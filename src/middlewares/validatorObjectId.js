const { Types } = require("mongoose");

const validarObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      mensaje: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
    });
  }

  next();
};

const validarPostId = (req, res, next) => {
  const { postId } = req.params;

  if (!Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      mensaje: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
    });
  }

  next();
};

const validarFollowId = (req, res, next) => {
  const { follower, followed } = req.params;

  if (!Types.ObjectId.isValid(follower) || !Types.ObjectId.isValid(followed)) {
    return res.status(400).json({
      mensaje: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
    });
  }

  next();
};

const validarPostImageIds = (req, res, next) => {
  const { id, imageId } = req.params;

  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(imageId)) {
    return res.status(400).json({
      mensaje: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
    });
  }

  next();
};

const validarExchangeBody = (req, res, next) => {
  const { postId, exchangedWithId } = req.body;
  if (!postId || !exchangedWithId) {
    return res.status(400).json({ message: "Faltan postId o exchangedWithId" });
  }
  if (
    !Types.ObjectId.isValid(postId) ||
    !Types.ObjectId.isValid(exchangedWithId)
  ) {
    return res
      .status(400)
      .json({ message: "postId o exchangedWithId inválidos" });
  }
  next();
};

const validarRequestExchange = (req, res, next) => {
  const { postId, requesterId } = req.body;
  if (!postId || !requesterId) {
    return res.status(400).json({ message: "Faltan postId o requesterId" });
  }
  if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(requesterId)) {
    return res.status(400).json({ message: "postId o requesterId inválidos" });
  }
  next();
};

module.exports = {
  validarObjectId,
  validarPostId,
  validarFollowId,
  validarPostImageIds,
  validarExchangeBody,
  validarRequestExchange,
};
