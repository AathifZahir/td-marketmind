const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { requireAuth } = require("../middleware/auth");

// Apply middleware to routes
router.post("/ai-request", requireAuth, chatController.processAIRequest);
router.get("/history", requireAuth, chatController.getChatHistory);
router.post(
  "/generateInitialRecommendations",
  requireAuth,
  chatController.generateInitialRecommendations
);

module.exports = router;
