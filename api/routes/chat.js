const express = require("express");
const router = express.Router();
const path = require("path");
const { createChat } = require("../../utility/chatController");

const { io } = require("../../index");

router.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../../../imeo", "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chatMessage", (message) => {
    io.emit("chatMessage", message);
    console.log(message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
