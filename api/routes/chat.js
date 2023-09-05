const express = require("express");
const app = express.Router();
const authToken = require("../../utility/authToken");
const { Message } = require("../../db");
const io = require("../../index");

/**
 * @path /api/chat/
 * + Metodo: GET
 * * Descrizione: Restituisce i messaggi di una room specifica dal database.
 *   Params:
 * ! :room (la room da cercare nel database, composta da from-to).
 */
// app.post("/message", authToken, async (req, res) => {
//   const { room, message } = req.body;
//   const newMessage = new Message({
//     content: message.content,
//     from: message.from,
//     to: message.to,
//   });
//   try {
//     await newMessage.save();
//     console.log(message);
//     io.to(room).emit("sendMessage", message);
//     res.status(200);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching messages" });
//   }
// });

app.get("/", authToken, async (_, res) => {
  //imposto richiesta get sul path /api/users
  try {
    const message = await Message.find({}, "-__v", { lean: true }); // salvo il risultato di un arra
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);

    return res.status(500).json(error.message);
  }
});

module.exports = app;
