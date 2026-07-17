const express = require("express");
const router = express.Router();

const aiController = require("../Controllers/aiController");

router.post("/chat", aiController.chat);

module.exports = router;
