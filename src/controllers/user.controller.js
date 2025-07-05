const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const redisClient = require("../redis")

const getUsers = async (_, res) => {
  try {
    const users = await User.find().select('userName email "-__V"').lean();
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('userName email "-__V"').lean();
    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }
    await redisClient.set(id, JSON.stringify(user), { EX: 60 });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { userName } = req.body;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Este userName ya está siendo utilizado" });
    }

    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await redisClient.set(id, JSON.stringify(req.body));
    res
      .status(200)
      .json({ message: "Usuario actualizado", usuario: updatedUser });
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

    await redisClient.del(id);
    res
      .status(200)
      .json({ message: "Usuario eliminado", usuario: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteById };
