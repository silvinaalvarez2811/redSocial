const Post = require("../models/post");
const Comment = require("../models/comment");
const PostImage = require("../models/postImage");
const User = require("../models/user");
const { saveImage } = require("../aditionalFunctions/image");
const { obtenerFechaLimite } = require("../aditionalFunctions/comment");
const redisClient = require("../redis");

const getPosts = async (req, res) => {
  try {
    const { status, userId } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }
    if (userId) {
      filter.userId = userId;
    }

    const posts = await Post.find(filter).select("-__v");
    const cacheKey = `Posts`;

    await redisClient.set(cacheKey, JSON.stringify(posts), { EX: 300 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = `Post-${id}`;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
    }

    await redisClient.set(cacheKey, JSON.stringify(post), { EX: 1800 });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllPostsWithImagesComments = async (req, res) => {
  try {
    const fechaLimite = obtenerFechaLimite();

    const posts = await Post.find({})
      .select("-__v")
      .populate("images", "imageUrl")
      .populate("userId", "userName email")
      .populate({
        path: "comments",
        match: { createdAt: { $gte: fechaLimite } },
        select: "text userId createdAt",
        populate: { path: "userId", select: "userName" },
      });

    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ message: "Error en servidor", error: e.message });
  }
};
const getPostwithImagesCommentsById = async (req, res) => {
  try {
    const id = req.params.id;
    const fechaLimite = obtenerFechaLimite();
    const cacheKey = `Post-all-${id}`;

    const data = await Post.findById(id)
      .select("-__v")
      .populate("images", "imageUrl")
      .populate("userId", "userName email ")
      .populate({
        path: "comments",
        match: { createdAt: { $gte: fechaLimite } },
        select: "text userId createdAt",
        populate: { path: "userId", select: "userName" },
      });

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 300 });
    res.status(200).json(data);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

const createPost = async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.files:", req.files);

  try {
    const { description, userId, lookingFor } = req.body;

    if (!userId || !description || !lookingFor) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Crear el post inicialmente sin imágenes
    const newPost = await Post.create({ description, userId, lookingFor });

    if (req.files && req.files.length > 0) {
      const imagesData = req.files.map((file) => ({
        postId: newPost._id,
        imageUrl: `/uploads/${file.filename}`, // importante que sea relativo al server
      }));

      const createdImages = await PostImage.create(imagesData);

      await Post.updateOne(
        { _id: newPost._id },
        { images: createdImages.map((img) => img._id) }
      );
    }

    const postFinal = await Post.findById(newPost._id)
      .select("-__v")
      .populate("images", "imageUrl")
      .populate("userId", "userName")
      .lean();

    res.status(201).json(postFinal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = `Post-${id}`;

    const { description, userId, lookingFor } = req.body;

    if (!description || !userId || !lookingFor) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    post.description = description;
    post.userId = userId;
    post.lookingFor = lookingFor;

    await post.save();

    if (req.files && req.files.length > 0) {
      //guarda las imagenes nuevas que se van a agregar
      req.files.forEach((file) => saveImage(file));
      //borrar todas las imagenes que tenía el post
      await PostImage.deleteMany({ postId: id });
      //crea una nueva collecion con las imagenes nuevas
      const postImages = req.files.map((file) => ({
        imageUrl: `/uploads/${file.filename}`,
        postId: id,
      }));
      await PostImage.create(postImages);
      //trae todas las imagenes relacionadas a este post
      const idImages = await PostImage.find({ postId: post._id }).select("_id");
      //armo un array con los ids
      const imageIds = idImages.map((img) => img._id);
      //actualiza en campo images en post (que es un array)
      //$set reemplaza el valor actual de images con el nuevo array
      await Post.updateOne({ _id: post._id }, { $set: { images: imageIds } });
    }
    const postUpdated = await Post.findById(id)
      .populate("images")
      .populate("userId", "userName")
      .lean();

    await redisClient.set(cacheKey, JSON.stringify(post), { EX: 1800 });
    res.status(200).json(postUpdated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
    }
    await Comment.deleteMany({ postId });
    await PostImage.deleteMany({ postId });
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post eliminado correctamente", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePostImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const cacheKey = `Post-${id}`;

    const deletedImage = await PostImage.findOneAndDelete({
      postId: id,
      _id: imageId,
    });
    if (!deletedImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    const post = await Post.findById(id);
    post.images.pull(imageId);
    await post.save();

    await redisClient.del(`PostImage-${imageId}`);
    await redisClient.set(cacheKey, JSON.stringify(post));
    res.status(200).json({ message: "Imagen eliminada correctamente", post });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

const updatePostImagesById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `Post-${id}`;

    const post = await Post.findById(id);

    req.files.map((file) => saveImage(file));
    const imagesRecords = req.files.map((file) => ({
      imageUrl: `/uploads/${file.filename}`,
      postId: id,
    }));
    await PostImage.deleteMany({ postId: id });
    await PostImage.create(imagesRecords);

    const idImages = await PostImage.find({ postId: id }).select("_id");
    await Post.updateOne({ _id: id }, { $set: { images: idImages } });

    await redisClient.set(cacheKey, JSON.stringify(post));
    res.status(201).json({ message: `Imagenes actualizadas correctamente` });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};
const requestExchange = async (req, res) => {
  try {
    const { postId, requesterId } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Publicación no  encontrada" });
    }
    if (post.status !== "available") {
      return res
        .status(400)
        .json({ message: "Publicación no disponible para el intercambio" });
    }
    post.status = "engaged";
    post.requestedBy = requesterId;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("error en el pedido de intercambio".error);
    res.status(500).json({ message: "error interno del servidor" });
  }
};

const confirmExchange = async (req, res) => {
  try {
    const { postId, exchangedWithId, userId } = req.body;
    const post = await Post.findById(postId);
    const exchangedWithUser = await User.findById(exchangedWithId);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }
    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Debe ser el dueño del post para confirmar el intercambio",
      });
    }
    if (!exchangedWithUser) {
      return res
        .status(404)
        .json({ message: "Usuario que quiere intercambiar no encontrado" });
    }
    if (post.status !== "engaged") {
      return res.status(400).json({
        message:
          "El intercambio no puede confirmarse. La publicación debe estar en estado 'engaged'",
      });
    }
    //actualizar el status
    post.status = "completed";
    post.exchangedWith = exchangedWithId;

    await post.save();
    //Agregar al historial del user de la publicacion
    await User.findByIdAndUpdate(post.userId, {
      $push: {
        history: {
          postId,
          exchangedWith: exchangedWithId,
          review: null,
          valuation: null,
          isValued: false,
        },
      },
    });
    //agregar al historial del user con el que se intercambia
    await User.findByIdAndUpdate(exchangedWithId, {
      $push: {
        history: {
          postId,
          exchangedWith: post.userId,
          review: null,
          valuation: null,
          isValued: false,
        },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    console.error("Error en confirmExchange:", error);
    res.status(500).json({ message: "error interno del servidor" });
  }
};

module.exports = {
  getPosts,
  getPostById,
  getPostwithImagesCommentsById,
  createPost,
  updatePost,
  deleteById,
  deletePostImage,
  updatePostImagesById,
  requestExchange,
  confirmExchange,
  getAllPostsWithImagesComments,
};
