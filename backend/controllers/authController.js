const { generateToken } = require("../utils/jwt");

// Backend: Generate user ID and set cookie
exports.generateUserId = (req, res) => {
  const userId = `user-${Date.now()}`;
  const token = generateToken(userId);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour
  });

  res.json({ userId });
};
