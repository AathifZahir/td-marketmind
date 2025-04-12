/* File: ./backend\models\Chat.js */
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // Add index for better query performance
  },
  messages: [
    {
      text: String,
      isUser: Boolean,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
