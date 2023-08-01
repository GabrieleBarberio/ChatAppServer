const express = require("express");
const app = express.Router();

const bcrypt = require("bcryptjs");
const { User } = require("../../db");

/**
 * @path /api/login
 */
app.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const user = await User.findOne({
      user_name: user_name,
    });
    if (!user) {
      return res.status(404).send("User doesn't exist");
    }
    if (await bcrypt.compare(password, user.password)) {
      return res.status(200).send("Login successful");
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    return res.status(500).send();
  }
});

module.exports = app;
