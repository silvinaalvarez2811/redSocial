const express = require("express");
const redisClient = require("./redis");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const conectarDB  = require('./config/db');
const { createServer } = require('node:http');
const { initWebSocket } = require('./config/webSocket');


const swaggerDoc = YAML.load(path.join(__dirname, "./docs/swagger.yml"));
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app); // Creo el servidor http
initWebSocket(server);

app.use(cors()); // permite conexiones desde el frontend

//Rutas
const {
  userRoute,
  postRoute,
  postImageRoute,
  commentRoute,
  loginRoute,
} = require("./routes");

conectarDB();

app.use(express.json());
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/postimages", postImageRoute);
app.use("/comments", commentRoute);
app.use("/login", loginRoute);
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // acceso a imágenes subidas
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

server.listen(PORT, async () => {
  console.log(`Documentación Swagger: http://localhost:5000/api-docs`);
  console.log(`WebSocket y servidor escuchando en http://localhost:${PORT}`)
  await redisClient.connect();
});