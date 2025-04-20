const jwt = require("jsonwebtoken");

// 6 months in seconds: 6 * 30 * 24 * 60 * 60 = 15,552,000
const SIX_MONTHS_IN_SECONDS = 15552000;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: SIX_MONTHS_IN_SECONDS,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
