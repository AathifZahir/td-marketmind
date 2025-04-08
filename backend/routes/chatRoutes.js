const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/ai-request", chatController.processAIRequest);

module.exports = router;
