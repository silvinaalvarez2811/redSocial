const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName });
  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

  res.status(200).json({ message: "Login exitoso" });
});

module.exports = router;