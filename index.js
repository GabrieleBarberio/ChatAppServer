require("dotenv").config();
const express = require("express");

const app = express();
const http = require("http");
const server = http.createServer(app);

const db = require("./db");

const cors = require("cors");
const helmet = require("helmet");

app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const path = require("path");

const { SERVER_PORT } = process.env;
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use("/api", require("./api"));

db.connect();

const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Error: you are not authorized");
  }

  const token = authHeader.split(" ")[1]; // splitto gli spazi della stringa e mi prendo il secondo elemento per recuperare il token split== ["Bearer","token"]

  if (!token) {
    return res.status(401).send("Error: you are not authorized");
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("Error: you are not authorized");
  }
};

server.listen(SERVER_PORT, () => {
  console.log(`Server up and running on port ${SERVER_PORT}`);
});
/**
 *
 * path localhost:3030/
 */
app.get("/chat", (_, res) => {
  res.sendFile(path.join(__dirname, "../../../imeo", "index.html"));
});
const chat = io.of("/");

//     path namespace evnt       socket che si conentte
chat.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.join("room");
  socket.on("chatMessage", (message, autor) => {
    io.to("room").emit("chatMessage", message, autor);
    console.log(message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
