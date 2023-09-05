const jwt = require("jsonwebtoken");

/**
 * headers:{
 *    authorization: `Bearer ${token}`
 * }
 */

const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Error: you are not authorized");
  }

  const token = authHeader.split(" ")[1]; // splitto gli spazi della stringa e mi prendo il secondo elemento per recuperare il token split== ["Bearer","token"]

  if (!token) {
    return res.status(401).send("Error: you are not authorized");
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("Error: you are not authorized");
  }
};

module.exports = authToken;
