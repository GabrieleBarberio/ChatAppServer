const chatModel = require("../db/models/Chat");
//createChat
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] }, //trovo la chat con i membri giusti ($all: operatore che dice devono esserci tutti)
    });

    if (chat) return res.status(200).json(chat); // se esiste la mando al client

    const newChat = new chatModel({
      members: [firstId, secondId], // altrimenti la creo
    });

    const response = await newChat.save(); //salvo nel db
    res.status(200).json(response); //la mando al client
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
//findUsersChats

const findUserChat = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: { userId } }, //$in: operatore mongodb che dice deve essere dentro
    });

    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

//findChat

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = { createChat, findUserChat, findChat };
