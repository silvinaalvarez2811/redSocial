require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("./src/models/Post");
const User = require("./src/models/User");
const Comment = require("./src/models/Comment");
const PostImage = require("./src/models/PostImage");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    await PostImage.deleteMany({});
    console.log("Datos del seed eliminados.");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
