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


const User = mongoose.model("User", userSchema);
module.exports = User;
