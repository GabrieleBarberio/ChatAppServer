const express = require("express");
const router = express.Router();

router.use("/users", require("./routes/users"));
router.use("/chat", require("./routes/chat"));
// router.use("/chat", require("./routes/chat"));

module.exports = router;
