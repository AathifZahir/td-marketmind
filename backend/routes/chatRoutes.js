const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/ai-request", chatController.processAIRequest);
router.get("/getLatestResponse", chatController.getLatestResponse);
router.post(
  "/generateInitialRecommendations",
  chatController.generateInitialRecommendations
);

module.exports = router;
