const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId es requerido"],
    },

    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      validate: {
        validator: (t) => t.trim().length > 0,
        message: () => "El post debe contener una descripción",
      },
    },

    lookingFor: {
      type: String,
      required: [true, "lookingFor es requerido"],
       validate: {
        validator: (t) => t.trim().length > 0,
        message: () => "El post debe contener una descripción",
      },
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "PostImage",
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    collection: "posts",
  }
);
//virtual para poder recibir muchos comentarios
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  justOne: false,
});

//virtuals para relación n:m entre post-tag
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
