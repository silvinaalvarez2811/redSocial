const express = require("express");
const conectarDB = require("./config/db");
const redisClient = require("./redis");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require('path');
const swaggerDoc = YAML.load(path.join(__dirname, './docs/swagger.yml'));
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Rutas
const {
  userRoute,
  postRoute,
  postImageRoute,
  commentRoute,
} = require("./routes");

conectarDB();

app.use(express.json());

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/postimages", postImageRoute);
app.use("/comments", commentRoute);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación Swagger: http://localhost:${PORT}/api-docs`);
  await redisClient.connect()
});
