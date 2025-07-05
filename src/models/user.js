const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName es requerido"],
      unique: [true, "ya existe ese userName"],
    },

    email: {
      type: String,
      required: [true, "email es requerido"],
      validate: {
        validator: (t) => validator.isEmail(t),
        message: (props) => `${props.value} no es un email válido`,
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Usuarios que siguen al usuario del localField
userSchema.virtual("follower", {
  ref: "Follow",
  localField: "_id",
  foreignField: "followedId",
  justOne: false,
});
// Usuarios a los que el localField sigue
userSchema.virtual("followed", {
  ref: "Follow",
  localField: "_id",
  foreignField: "followerId",
  justOne: false,
});

// Hacer que los virtuales se incluyan al convertir en JSON o en objeto
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
