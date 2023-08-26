const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  is_read: { type: Boolean, default: false },
  content: String,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
