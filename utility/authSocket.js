const jwt = require("jsonwebtoken");

const authSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return console.log("Non sei autorizzato");
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    socket.user = user;
    next();
  } catch (error) {
    console.log("Non sei autorizzato");
  }
};

module.exports = authSocket;
