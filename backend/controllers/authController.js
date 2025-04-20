const { generateToken, verifyToken } = require("../utils/jwt");

// Backend: Generate user ID and set cookie
exports.generateUserId = (req, res) => {
  const userId = `user-${Date.now()}`;
  const token = generateToken(userId);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15552000000, // 6 months in milliseconds
    sameSite: "strict", // Enhance security
  });

  res.json({ userId });
};

// Check authentication status
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

// New refresh token method
exports.refreshToken = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    try {
      // Verify the existing token
      const { userId } = verifyToken(token);

      // Generate a new token with a fresh expiration
      const newToken = generateToken(userId);

      // Set the new token in a cookie
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15552000000, // 6 months in milliseconds
        sameSite: "strict",
      });

      res.json({
        authenticated: true,
        userId,
      });
    } catch (err) {
      console.error("Token refresh failed:", err.message);
      res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    console.error("Auth refresh error:", error);
    res.status(401).json({ authenticated: false });
  }
};
