const Comment = require("../models/comment");
const { obtenerFechaLimite } = require("../aditionalFunctions/comment");

const createComment = async (req, res) => {
  try {
    //la fecha de creacion se requiere para poder crear comments con fechas
    // que superen el limite y probar la funcionalidad
    const { postId, userId, text, createdAt } = req.body;
    if (!postId || !userId || !text) {
      return res
        .status(400)
        .json({ error: "Faltan  datos que son requeridos" });
    }
    const newComment = new Comment({ postId, userId, text, createdAt });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los comentarios que no superen la fecha limite
const getComments = async (req, res) => {
  try {
    const fechaLimite = obtenerFechaLimite();
    const comments = await Comment.find({
      createdAt: { $gte: fechaLimite },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un comentario por id - lo trae aunque sea antiguo
const getCommentById = async (req, res) => {
  try {
    const id = req.params.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    if (comment.userId) {
      await comment.populate("userId", "userName");
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener comentarios de un post (solo los que no superen la fecha limite)
const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const fechaLimite = obtenerFechaLimite();

    const comments = await Comment.find({
      postId,

      createdAt: { $gte: fechaLimite },
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); //new para que me devuelva actualizado
    if (!updated) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment)
      return res.status(404).json({ error: "Comentario no encontrado" });

    res.status(200).json({ message: "Comentario eliminado", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
