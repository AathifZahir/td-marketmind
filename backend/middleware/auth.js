const { verifyToken } = require("../utils/jwt");

exports.requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        details: "No token provided",
      });
    }

    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Authentication failed",
        details: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Authentication failed",
        details: "Token expired",
      });
    }

    next(error);
  }
};
