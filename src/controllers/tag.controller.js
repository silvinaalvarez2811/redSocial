const Post = require("../models/post");
const Tag = require("../models/tag");

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().populate("posts", "description userId");
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "El nombre del tag es requerido" });
    }
    const existingTag = await Tag.findOne({ name });
    //en model definimos el tag como unique
    if (existingTag) {
      return res.status(409).json({ message: "Tag existente" });
    }
    const newTag = await Tag.create({ name });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTag = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "El nombre del tag es requerido" });
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res
        .status(404)
        .json({ message: "Tag no encontrado o ID inválido" });
    }

    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res
        .status(404)
        .json({ message: "Tag no encontrado o ID inválido" });
    }

    // para quitar la referencia del tag en el array de tags en post - $pull
    await Post.updateMany({ tags: id }, { $pull: { tags: id } });

    res
      .status(200)
      .json({ message: "Tag y referencias eliminadas correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTags, createTag, updateTag, deleteById };
