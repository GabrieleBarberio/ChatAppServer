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
  cors: { origin: "*" },
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
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../../../imeo", "index.html"));
});

//route per chiamare la collection
io.on("connection", (socket) => {
  console.log("Un utente si è connesso");

  socket.on("joinRoom", (room) => {
    console.log(`L'utente si è unito alla stanza: ${room}`);
    socket.join(room);
  });

  socket.on("sendMessage", async (message, room) => {
    if (!mongoose.Types.ObjectId.isValid(message.to)) {
      socket.emit(
        "errorMessage",
        "Si è verificato un errore con la validazione del ID"
      );
      console.log("ID non valido");
      return;
    }
    console.log("send", message);
    const newMessage = new Message({
      content: message.content,
      from: message.author._id,
      to: message.to,
    });
    try {
      await newMessage.save();

      io.to(room).emit("receiveMessage", message);

      console.log(message);
    } catch (error) {
      console.error("Errore: ", error);
      socket.emit(
        "errorMessage",
        "Si è verificato un errore durante l'invio del messaggio."
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("L'utente si è disconnesso");
  });
});
