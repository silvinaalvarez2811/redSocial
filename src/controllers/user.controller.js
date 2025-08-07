const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const redisClient = require("../redis");
const { saveAvatarImage, deleteImage } = require("../aditionalFunctions/image");
const socketNotification = require("../aditionalFunctions/notification")

const getUsers = async (_, res) => {
  try {
    const users = await User.find().select("-__v").lean();
    const cacheKey = `Users`;

    await redisClient.set(cacheKey, JSON.stringify(users), { EX: 300 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistoryById = async (req, res) => {
  try {
    const id = await req.params.id;
    const user = await User.findById(id)
      .populate("history.postId")
      .populate("history.exchangedWith", "firstName lastName avatar"); //datos del otro user

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtiene todas las notificaciones de un usuario
const getNotificationsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("userName")
      .populate("notifications.postId", "description")
      .populate("notifications.from", "userName avatar")

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener el post con sólo el comentario del usuario que lo solicita
// Usado para el post de la notificación
const getAlertOfPost = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId)
      // .select("-__v")
      .populate("images", "imageUrl")
      .populate("requestedBy", "userName")
      .populate({
        path: "comments",
        match: { userId: { $eq: userId } },
        select: "text userId createdAt",
        populate: { path: "userId", select: "userName" },
      });

    if (!post) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ userName: username });

    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('userName email "-__V"').lean();
    const cacheKey = `User-${id}`;

    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }
    await redisClient.set(cacheKey, JSON.stringify(user), { EX: 1800 });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { userName, password, email, firstName, lastName, location } =
      req.body;

    if (
      !userName ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !location
    ) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Este userName ya está siendo utilizado" });
    }

    const newUser = await User.create({
      userName,
      password,
      email,
      firstName,
      lastName,
      location,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { postId, from, date } = req.body;

    if ( !postId || !from || !date ) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    socketNotification({ id, postId, from });

    const user = await User.findByIdAndUpdate(id, {
        $push: {
          notifications: { postId,from, date }
        }
      }
    );

    // Actualizo el campo "requestedBy" del post para que muestre que fue solicitado por un usuario
    // Falta cambiar el campo de status del post a "engaged"
    await Post.updateOne({ _id: postId }, {$set: {requestedBy: from }});

    if (!user) {
      return res
        .status(400)
        .json({ message: "Usuario inexistente" });
    }

    
    res.status(201).json(user.notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { userName, password, email, firstName, lastName, bio, location } =
      req.body;
    const cacheKey = `User-${id}`;

    const user = await User.findByIdAndUpdate(
      id,
      { userName, email, firstName, lastName, bio, location },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (req.file) {
      const imageAvatar = saveAvatarImage(user.userName, req.file);
      user.avatar = imageAvatar.replace("./", "/");
    }

    user.password = password;
    await user.save();

    await redisClient.set(cacheKey, JSON.stringify(user), { EX: 1800 });
    res.status(200).json({ message: "Usuario actualizado", usuario: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    await Comment.deleteMany({ user: id });
    await Post.deleteMany({ user: id });

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (deletedUser.avatar && deletedUser.avatar.includes("uploads/avatar")) {
      deleteImage(deletedUser.avatar);
    }

    res
      .status(200)
      .json({ message: "Usuario eliminado", usuario: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserByUsername,
  getUserById,
  getHistoryById,
  getNotificationsById,
  getAlertOfPost,
  createUser,
  createNotification,
  updateUser,
  deleteById,
  getHistoryById,
};
