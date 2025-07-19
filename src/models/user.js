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
    firstName: {
      type: String,
      required: [true, "el nombre es requerido"],
    },
    lastName: {
      type: String,
      required: [true, "el apellido es requerido"],
    },
    bio: {
      type: String,
      required: [true, "la bio es obligatoria"],
      minlenght: [20, "La bio debe tener al menos 20 caracteres"],
      maxlenght: [200, "La bio no puede tener más de  200 caracteres"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "la ubicación es requerida"],
    },
    reputation: { type: Number, default: 0 },
    //aca va la url de la imagen, o si no ponemos la inicial del nickname o del nombre completo
    avatar: { type: String },

    //para poder armar el perfil del usuario
    history: [
      {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        exchangedWith: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
        review: String,
        valuation: {
          type: Number,
          min: [0, "La valoración no puede ser menor que 0"],
          max: [10, "La valoración no puede ser mayor que 10"],
          default: 0,
        },
        isValued: { type: Boolean, default: false },
      },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);
//para poder obtener el nombre completo del ususario
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
