const express = require("express");
const app = express.Router();

/**
 * @path /api/users
 */
app.use("/users", require("./routes/users")); // definizione path user, dopo api/

// app.use("/login", require("./routes/login")); // definizione path login, dopo api/

module.exports = app;
