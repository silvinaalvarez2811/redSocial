const mongoose = require("mongoose");
const { Schema } = mongoose;

const postImageSchema = new mongoose.Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "postId es requerido"],
    },
    imageUrl: {
      type: [String],
      required: [true, "imageUrl es requerido"],
    },
  },
  {
    collection: "postImages",
  }
);

const PostImage = mongoose.model("PostImage", postImageSchema);
module.exports = PostImage;
