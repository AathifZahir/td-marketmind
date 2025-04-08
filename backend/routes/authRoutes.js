const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/generate-user-id", authController.generateUserId);

module.exports = router;
