const jwt = require("jsonwebtoken");
const User = require("../models/log_user.js");


exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "You are not logged in! Please log in to get access." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return res
        .status(401)
        .json({ status: "fail", message: "The user belonging to this token no longer exists." });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error on authMiddleWare ya 7beby:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid token. Please log in again!" });
    }
    res.status(500).json({
      status: "error",
      message: "An unexpected authentication error occurred.",
    });
  }
};