require("dotenv").config();
const express = require("express");
const { WSinit, io } = require("./socket");

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
const authToken = require("./utility/authToken");
const authSocket = require("./utility/authSocket");

app.use("/api", require("./api"));

db.connect();

WSinit();

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

app.post("/api/chat/message", authToken, async (req, res) => {
  const { room, message } = req.body;
  const newMessage = new Message({
    content: message.content,
    from: message.from,
    to: message.to,
  });
  try {
    await newMessage.save();
    console.log(message);
    io.to(room).emit("sendMessage", message);
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});
