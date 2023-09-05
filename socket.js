const { Server } = require("socket.io");
const authSocket = require("./utility/authSocket");
const express = require("express");
require("dotenv").config();
const { SOCKET_PORT } = process.env;

const app = express();
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
io.use(authSocket);
io.on("connection", (socket) => {
  console.log("Un utente si è connesso");

  socket.on("joinRoom", (room) => {
    console.log(`L'utente si è unito alla stanza: ${room}`);
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("L'utente si è disconnesso");
  });
});
const WSinit = () => {
  server.listen(SOCKET_PORT, () => {
    console.log(`WS up and running on port ${SOCKET_PORT}`);
  });
};

module.exports = { io, WSinit };
