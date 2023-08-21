const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);
const chat = model("Chat", chatSchema);

module.exports = chat;
