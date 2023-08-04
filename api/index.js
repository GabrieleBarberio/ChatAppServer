const express = require("express");
const app = express.Router();

/**
 * @path /api/users
 */
app.use("/users", require("./routes/users")); // definizione path user, dopo api/

module.exports = app;
