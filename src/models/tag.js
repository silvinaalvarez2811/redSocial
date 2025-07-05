const mongoose = require("mongoose");
const { Schema } = mongoose;
//const validator = require("validator");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: "Tag",
    required: [true, "Name es requerido"],
    unique: true,
  },
});
//virtual para los posts que tengan este tag

tagSchema.virtual("posts", {
  ref: "Post", //nombre de la collection
  localField: "_id", // id de tag
  foreignField: "tags", //nombre del campo en Post
  justOne: false,
});
tagSchema.set("toJSON", { virtuals: true });
tagSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Tag", tagSchema);
