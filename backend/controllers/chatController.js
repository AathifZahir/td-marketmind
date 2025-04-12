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

    // Get or create chat session
    let chatSession = await Chat.findOne({ userId });
    if (!chatSession) {
      chatSession = new Chat({ userId, messages: [] });
    }

    // Add user message to history
    chatSession.messages.push({
      text: query,
      isUser: true,
    });

    // Prepare conversation history for AI
    const conversationHistory = chatSession.messages.map((msg) => ({
      role: msg.isUser ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const key = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${key}`,
      {
        contents: conversationHistory,
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

    // Add AI response to history
    chatSession.messages.push({
      text: aiResponse,
      isUser: false,
    });

    await chatSession.save();

    res.json({
      response: aiResponse,
      history: chatSession.messages,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    res.status(500).json({ error: "Failed to process AI request" });
  }
};

exports.getChatHistory = async (req, res) => {
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

    const chatSession = await Chat.findOne({ userId });
    if (!chatSession) {
      return res.json({ messages: [] });
    }

    res.json({
      messages: chatSession.messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Update the generateInitialRecommendations to use the new message format
exports.generateInitialRecommendations = async (req, res) => {
  try {
    const { businessName, industry, goal, challenges } = req.body;
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

    const prompt = `Create marketing strategies for ${businessName} in the ${industry} industry. 
    Their primary goal is ${goal} and they're facing these challenges: ${challenges}. 
    Provide 3 specific recommendations.`;

    // Create or get chat session
    let chatSession = await Chat.findOne({ userId });
    if (!chatSession) {
      chatSession = new Chat({ userId, messages: [] });
    }

    // Add user message
    chatSession.messages.push({
      text: prompt,
      isUser: true,
    });

    const key = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${key}`,
      {
        contents: chatSession.messages.map((msg) => ({
          role: msg.isUser ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
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

    // Add AI response
    chatSession.messages.push({
      text: aiResponse,
      isUser: false,
    });

    await chatSession.save();

    res.json({
      response: aiResponse,
      history: chatSession.messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
