const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName es requerido"],
      unique: [true, "ya existe ese userName"],
    },

    password: {
      type: String,
      required: function() {
        return this.isNew; // Solo requerido al crear
      },
      validate: [
        {
          validator: (p) => validator.isLength(p, { min: 8, max: 15 }),
          message: "La contraseña debería tener entre 8 y 15 caracteres",
        },
        {
          validator: (p) => validator.isAlphanumeric(p),
          message: "La contraseña debe contener caracteres alfanuméricos",
        },
      ],
    },

    email: {
      type: String,
      required: [true, "El email es requerido"],
      validate: {
        validator: (t) => validator.isEmail(t),
        message: (props) => `${props.value} no es un email válido`,
      },
    },
    firstName: {
      type: String,
      required: [true, "El nombre es requerido"],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es requerido"],
    },
    bio: {
      type: String,
      default: "Ninguna",
      minlenght: [20, "La bio debe tener al menos 20 caracteres"],
      maxlenght: [200, "La bio no puede tener más de  200 caracteres"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "La ubicación es requerida"],
    },
    reputation: { type: Number, default: 0 },
    //aca va la url de la imagen, o si no ponemos la inicial del nickname o del nombre completo
    avatar: { type: String, default: "" },

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

// Para poder obtener el nombre completo del usuario
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
