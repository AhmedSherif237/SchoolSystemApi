// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models").User;
const RefreshToken = require("../models").RefreshToken;

const createAccessToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sendRefreshTokenAsCookie = (res, token) => {
  res.cookie("jwt_refresh", token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
};

// POST http://localhost:5000/api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide username and password!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    const accessToken = createAccessToken(newUser.id, newUser.username);
    const refreshToken = createRefreshToken(newUser.id);
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({
      token: refreshToken,
      userId: newUser.id,
      expiresAt: refreshTokenExpiresAt,
    });

    sendRefreshTokenAsCookie(res, refreshToken);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token: accessToken,
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "fail",
        message: "Username already exists. Please choose another one.",
      });
    }
    console.error("SignupAuth function error ya Doksh:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during signup.",
    });
  }
};


// POST http://localhost:5000/api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide username and password!",
      });
    }

    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect username or password",
      });
    }

    const accessToken = createAccessToken(user.id, user.username);
    const refreshToken = createRefreshToken(user.id);
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    });

    sendRefreshTokenAsCookie(res, refreshToken);

    res.status(200).json({
      status: "success",
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("LoginAuth function error ya Doksh", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during login.",
    });
  }
};

exports.reCreateAccessToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt_refresh) {
      return res
        .status(401)
        .json({ status: "fail", message: "No Refresh Token provided." });
    }

    const refreshTokenFromCookie = cookies.jwt_refresh;

    const decoded = jwt.verify(refreshTokenFromCookie, process.env.JWT_SECRET);

    const storedRefreshToken = await RefreshToken.findOne({
      where: {
        token: refreshTokenFromCookie,
        userId: decoded.id,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
      if (storedRefreshToken) {
        await storedRefreshToken.destroy();
      }
      return res
        .status(403)
        .json({ status: "fail", message: "Invalid or expired Refresh Token." });
    }

    await storedRefreshToken.destroy();

    const user = storedRefreshToken.user;
    const newAccessToken = createAccessToken(user.id, user.username);
    const newRefreshToken = createRefreshToken(user.id);
    const newRefreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: newRefreshTokenExpiresAt,
    });

    sendRefreshTokenAsCookie(res, newRefreshToken);

    res.status(200).json({
      status: "success",
      token: newAccessToken,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("refreshToken function error ya Doksh:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(403)
        .json({ status: "fail", message: "Refresh Token invalid or expired." });
    }
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during token refresh.",
    });
  }
};

// POST http://localhost:5000/api/auth/logout
exports.logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt_refresh) {
      return res
        .status(204)
        .json({ status: "success", message: "No content to log out." });
    }

    const refreshTokenFromCookie = cookies.jwt_refresh;

    await RefreshToken.destroy({
      where: { token: refreshTokenFromCookie },
    });

    res.clearCookie("jwt_refresh", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully." });
  } catch (error) {
    console.error("logout function error ya Doksh", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during logout.",
    });
  }
};
