const express = require("express");
const app = express.Router();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { User } = require("../../db");

/**
 * @path /api/users
 * Metodo: GET
 * Descrizione: Restituisce un array con tutti gli utenti dal database.
 * Params: Nessun parametro richiesto.
 */
//*      middleware async
app.get("/", async (_, res) => {
  //imposto richiesta get sul path /api/users
  try {
    const users = await User.find({}, "-password -__v", { lean: true }); // salvo il risultato di un arra
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
});

/**
 * @path /api/users/:id
 * + Metodo: GET
 * * Descrizione: Restituisce un utente specifico dal database in base all'ID.
 *   Params:
 * !  :id (l'ID dell'utente da cercare nel database).
 */

app.get("/:id", async (req, res) => {
  const _id = req.params.id; // _id = quello passato nella richiesta
  try {
    const user = await User.findOne({ _id }, "-password -__v", { lean: true }); // cerco _id, escludo pass e __V con -, lean: true opzione per i json
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
});

/**
 * @path /api/users
 * + Metodo: POST
 * * Descrizione: Creazione di un nuovo utente nel database.
 *   Params:
 *  ! first_name
 *  ! last_name
 *  ! email
 *  ! user_name
 *  ! password
 */
app.post("/", async (req, res) => {
  const schema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    user_name: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    const data = await schema.validateAsync(req.body); //validazione dati body richiesta
    data.password = bcrypt.hashSync(data.password, 12); //cripto la pass con hashSync(passDaCryptare, numero iterazioni)
    const user = await User.create(data); // creo  nel database un documento sulla base del modello User(../db/models/User) passando data(dopo la validazione)
    delete user._doc.password; // elimino la pass prima di restituirla al client
    return res.status(201).json({ user: user._doc }); // rispondo dichiarando lo stato 201 (ok) e l'utente creato
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
});

/**
 * @path /api/users/login
 * + Metodo: POST
 * * Descrizione: Login dell'utente verificando le credenziali.(manca JWT)
 *   Params:
 *  ! user_name
 *  ! password
 */
app.post("/login", async (req, res) => {
  const { user_name, password } = req.body; // destrutturo il body della richiesta e prendo user_name e password
  try {
    const user = await User.findOne({ user_name }, { lean: true }); // trovo l'oggetto con user_name uguali tra db e req
    if (!user) {
      return res.status(400).send("User doesn't exist"); // se non esiste nel database errore
    }
    if (await bcrypt.compare(password, user.password)) {
      // se esiste e le password sono uguali, hai fatto il login
      return res.status(200).send("Login successful");
    } else {
      return res.status(401).send("Invalid password"); //altrimenti la pass è errata
    }
  } catch (error) {
    return res.status(500).send("fail to connect"); //per ogni altro errore 500
  }
});

module.exports = app;
