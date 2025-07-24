const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const redisClient = require("../redis");
const { saveAvatarImage, deleteImage } = require("../aditionalFunctions/image");

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

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({userName: username})

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
    const { userName, password, email, firstName, lastName, location } = req.body;

    if(!userName || !password || !email || !firstName || !lastName || !location) {
      return res.status(400).json({message: "Faltan datos requeridos"})
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Este userName ya está siendo utilizado" });
    }

    const newUser = await User.create({ userName, password, email, firstName, lastName, location});
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { userName, password, email, firstName, lastName, bio, location } = req.body
    const cacheKey = `User-${id}`;

    const user = await User.findByIdAndUpdate(id, { userName, email, firstName, lastName, bio, location }, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if(req.file) {
      saveAvatarImage(user.userName, req.file);
      user.avatar = `${req.file.destination}${user.userName} - ${req.file.originalname}`
    }

    user.password = password;
    await user.save()

    await redisClient.set(cacheKey, JSON.stringify(user), { EX: 1800 });
    res
      .status(200)
      .json({ message: "Usuario actualizado", usuario: user });
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

    if(deletedUser.avatar.includes('uploads/avatar')) {
      deleteImage(deletedUser.avatar)
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
  createUser,
  updateUser,
  deleteById,
  getHistoryById,
};
