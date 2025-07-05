const Post = require("../models/post");
const Comment = require("../models/comment");
const PostImage = require("../models/postImage");
const Tag = require("../models/tag");
const { saveImage } = require("../aditionalFunctions/image");
const { obtenerFechaLimite } = require("../aditionalFunctions/comment");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().select("-__v");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostwithImagesTagsCommentsById = async (req, res) => {
  try {
    const id = req.params.id;
    const fechaLimite = obtenerFechaLimite();

    const data = await Post.findById(id)
      .select("-__v")
      .populate("tags", "name")
      .populate("images", "imageUrl")
      .populate("userId", "userName email ")
      .populate({
        path: "comments",
        match: { createdAt: { $gte: fechaLimite } },
        select: "text userId createdAt",
        populate: { path: "userId", select: "userName" },
      });

    res.status(200).json(data);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};
const createPost = async (req, res) => {
  try {
    const { description, userId, tags } = req.body;

    if (!userId || !description) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Crear el post inicialmente sin tags ni imágenes
    const newPost = await Post.create({ description, userId });

    // Procesar tags: convertir string separado por coma en array limpio
    let tagArray = [];
    if (tags && typeof tags === "string") {
      tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }

    // Buscar o crear tags y guardar sus IDs
    const tagIds = [];
    for (const name of tagArray) {
      let tag = await Tag.findOne({ name });
      if (!tag) {
        tag = await Tag.create({ name });
      }
      tagIds.push(tag._id);
    }
    newPost.tags = tagIds;
    await newPost.save();

    // Si vienen archivos (imágenes) en req.files, guardarlos y crear registros
    if (req.files && req.files.length > 0) {
      // Guardar las imágenes en la carpeta uploads
      req.files.forEach((file) => saveImage(file));

      // Crear documentos PostImage referenciando al post
      const imagesData = req.files.map((file) => ({
        postId: newPost._id,
        imageUrl: file.destination + file.originalname,
      }));

      const createdImages = await PostImage.create(imagesData);

      // Guardar solo los IDs de las imágenes en el post
      await Post.updateOne(
        { _id: newPost._id },
        { images: createdImages.map((img) => img._id) }
      );
    }

    // Buscar el post creado con populate para devolver datos completos
    const postFinal = await Post.findById(newPost._id)
      .select("-__v")
      .populate("tags", "name")
      .populate({
        path: "images",
        select: "-__v",
      })
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

    const { description, userId } = req.body;

    if (!description || !userId) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    post.description = description;
    post.userId = userId;

    await post.save();

    if (req.files && req.files.length > 0) {
      //guarda las imagenes nuevas que se van a agregar
      req.files.forEach((file) => saveImage(file));
      //borrar todas las imagenes que tenía el post
      await PostImage.deleteMany({ postId: id });
      //crea una nueva collecion con las imagenes nuevas
      const postImages = req.files.map((file) => ({
        imageUrl: file.destination + file.originalname,
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
      .populate("tags", "name -_id")
      .populate("images")
      .populate("userId", "userName")
      .lean();

    res.status(200).json(postUpdated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTagsToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    let { tags } = req.body;

    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ message: "Debes enviar un array de tags" });
    }
    // Si tags viene como string, convertir a array
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    const tagIds = [];

    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = await Tag.create({ name: tagName });
      }
      tagIds.push(tag._id);
    }

    // Agregar solo los que no estén ya en post.tags
    tagIds.forEach((id) => {
      if (!post.tags.includes(id)) {
        post.tags.push(id);
      }
    });
    await post.save();

    res.status(200).json({ message: "Tags agregados", tags: post.tags });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar tags", error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no existente" });
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

    const postImages = await Post.findById(id).select("images");

    req.files.map((file) => saveImage(file));
    const imagesRecords = req.files.map((file) => ({
      imageUrl: file.destination + file.originalname,
      postId: id,
    }));
    await PostImage.deleteMany({ postId: id });
    await PostImage.create(imagesRecords);

    const idImages = await PostImage.find({ postId: id }).select("_id");
    await Post.updateOne({ _id: id }, { $set: { images: idImages } });

    res
      .status(201)
      .json({ message: `Imagenes actualizadas correctamente ${postImages}` });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  getPostwithImagesTagsCommentsById,
  createPost,
  updatePost,
  addTagsToPost,
  deleteById,
  deletePostImage,
  updatePostImagesById,
};
