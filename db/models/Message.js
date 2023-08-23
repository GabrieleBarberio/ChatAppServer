const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MessageSchema = new Schema( //schema == classe di mongoose che ci permette di creare lo schema del modello
  {
    author: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);
//+ strict opzione di mongoose:
//* true (impostazione predefinita): Quando strict è impostato su true, solo i campi definiti nello schema possono essere salvati nel documento del database.
//* false: Quando strict è impostato su false consente il salvataggio di campi aggiuntivi non definiti nello schema nel documento del database.

const Message = model("Message", MessageSchema); // creo Message, il modello definito in  MessageSchema

module.exports = Message;
