const mongoose = require("mongoose");

const connect = async () => {
  //connessione con il database tramite mongoose
  try {
    await mongoose.connect(process.env.ATLASS_CONNECTION_URI);

    console.log("MongoDB Atlas connected");
  } catch (error) {
    throw error;
  }
};

const models = {
  User: require("./models/User"), // Definisco i modelli disponibili, in questo caso solo User
  Message: require("./models/Message"),
};

module.exports = {
  connect,
  ...models, //esporto connect e tutti i modelli nell'oggetto models
};
