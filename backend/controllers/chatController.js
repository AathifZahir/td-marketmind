const axios = require("axios");
const Chat = require("../models/Chat");
const { verifyToken } = require("../utils/jwt");

exports.processAIRequest = async (req, res) => {
  try {
    const { query } = req.body;
    const token = req.cookies.token;

    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No token provided." });
    }

    const { userId } = verifyToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const key = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${key}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: query,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 65536,
          responseMimeType: "text/plain",
        },
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    // Save chat to database
    await Chat.create({
      userId,
      query,
      response: aiResponse,
    });

    res.json({
      userId,
      response: aiResponse,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    res.status(500).json({ error: "Failed to process AI request" });
  }
};

exports.getLatestResponse = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No token provided." });
    }

    const { userId } = verifyToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const latestChat = await Chat.findOne({ userId }).sort({ createdAt: -1 });
    if (!latestChat) {
      return res.status(404).json({ error: "No chat history found" });
    }

    res.json({
      response: latestChat.response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch latest response" });
  }
};
