require("dotenv").config();
const express = require("express");

const app = express();
const http = require("http");
const server = http.createServer(app);

const db = require("./db");

const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const Message = require("./db/models/Message");

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
//implementa: salvataggio dei msg nella collection
//route per chiamare la collection
chat.on("connection", (socket) => {
  // connessione ai client tramite evnt "connection"
  console.log("a user connected");

  socket.on("joinRoom", (room) => {
    // join della room in base agli id (l'evento joinRoom passa prende la room passata dal client recpientId+userId)
    console.log(`User joined room: ${room}`);
    socket.join(room);
  });

  socket.on("chatMessage", async (message) => {
    if (!mongoose.Types.ObjectId.isValid(message.to)) {
      console.log("Invalid 'to' ID");
      return;
    }
    const room = `${message.to}-${message.author._id}`;
    //enento chatMessage
    const newMessage = new Message({
      // salvo il messaggio nel db
      from: message.author._id,
      to: message.to,
      content: message.content,
    });
    try {
      await newMessage.save();
      chat.to(room).emit("chatMessage", message);
      console.log(message);
    } catch (error) {
      console.error("Errore: ", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
