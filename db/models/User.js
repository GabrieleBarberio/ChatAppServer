const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema( //schema == classe di mongoose che ci permette di creare lo schema del modello
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    user_name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);
//+ strict opzione di mongoose:
//* true (impostazione predefinita): Quando strict è impostato su true, solo i campi definiti nello schema possono essere salvati nel documento del database.
//* false: Quando strict è impostato su false consente il salvataggio di campi aggiuntivi non definiti nello schema nel documento del database.

const User = model("User", UserSchema); // creo User, il modello definito in  userSchema

module.exports = User;
