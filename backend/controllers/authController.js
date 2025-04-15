const { generateToken } = require("../utils/jwt");
const { verifyToken } = require("../utils/jwt");

// Backend:Generate user ID and set cookie
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

// New method to check authentication status
exports.checkAuthStatus = (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("Token in status check:", token ? "Present" : "Missing");

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    try {
      const { userId } = verifyToken(token);
      console.log("User authenticated:", userId);

      res.json({
        authenticated: true,
        userId,
      });
    } catch (err) {
      console.error("Token verification failed in status check:", err.message);
      res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    console.error("Auth status check error:", error);
    res.status(401).json({ authenticated: false });
  }
};
