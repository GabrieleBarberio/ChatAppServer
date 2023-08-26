const express = require("express");
const router = express.Router();
const authToken = require("../../utility/authToken");
const { Message } = require("../../db");

/**
 * @path /api/chat/:room
 * + Metodo: GET
 * * Descrizione: Restituisce i messaggi di una room specifica dal database.
 *   Params:
 * ! :room (la room da cercare nel database, composta da from-to).
 */
router.get("/:room", authToken, async (req, res) => {
  const { room } = req.params;
  const [from, to] = room.split("-");
  try {
    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});

module.exports = router;
