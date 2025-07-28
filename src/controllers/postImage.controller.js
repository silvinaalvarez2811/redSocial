const path = require("path");
const PostImage = require("../models/postImage");
const Post = require("../models/post");
const { deleteImage } = require("../aditionalFunctions/image");
const redisClient = require("../redis");

const getAllPostImages = async (req, res) => {
  try {
    const images = await PostImage.find({}).select("-__v");
    const cacheKey = `PostImages`;

    await redisClient.set(cacheKey, JSON.stringify(images), { EX: 300 });
    res.status(200).json(images);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

const getImagesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const images = await Post.findById(postId)
      .select("images")
      .populate("images", "imageUrl");
    const cacheKey = `Images-post-${postId}`;

    await redisClient.set(cacheKey, JSON.stringify(images), { EX: 300 });
    res.status(200).json(images);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

const createPostImages = async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
    }

    // multer ya guardó los archivos en 'uploads/', no hace falta moverlos
    const newImages = req.files.map((file) => ({
      postId,
      imageUrl: `/uploads/${file.filename}`, // ruta para el frontend
    }));

    const createdImages = await PostImage.create(newImages);
    const idImages = createdImages.map((img) => img._id);

    // Actualizar el post agregando las imágenes nuevas
    await Post.updateOne(
      { _id: postId },
      { $push: { images: { $each: idImages } } }
    );

    res.status(201).json({ message: "Imágenes agregadas correctamente", post });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

const updatePostImage = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `PostImage-${id}`;
    const image = await PostImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // Borrar imagen física anterior
    const oldImagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(image.imageUrl)
    );
    deleteImage(oldImagePath);

    // Actualizar url con la nueva imagen (ya guardada por multer)
    image.imageUrl = `/uploads/${req.file.filename}`;
    await image.save();

    // Actualizar el post
    const post = await Post.findById(image.postId);
    // No es necesario modificar el array de imágenes, ya que la imagen es la misma (solo se actualizó URL)
    // Pero si querés actualizar algo en el post, hacerlo aquí

    await redisClient.set(cacheKey, JSON.stringify(image), { EX: 1800 });

    res.status(201).json({ message: "Imagen actualizada correctamente" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const { postId, id } = req.params;

    const oldImage = await PostImage.findOneAndDelete({ _id: id });
    if (!oldImage) {
      return res
        .status(404)
        .json({ message: "Imagen no encontrada para borrar" });
    }

    // Borrar la imagen física
    const oldImagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(oldImage.imageUrl)
    );
    deleteImage(oldImagePath);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    post.images.pull(id);
    await post.save();

    res.status(200).json({ message: "Imagen eliminada correctamente", post });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
  }
};

module.exports = {
  getAllPostImages,
  getImagesByPost,
  createPostImages,
  updatePostImage,
  deleteById,
};
