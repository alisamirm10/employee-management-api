const User = require("../models/User");
const bcrypt = require("bcrypt");

///REFRESH TOKEN
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/// RERESH TOKENS
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (!storedToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({
        _id: storedToken._id,
      });

      return res.status(401).json({
        message: "Refresh token expired",
      });
    }

    const user = await User.findById(storedToken.user);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await RefreshToken.deleteOne({
      token: refreshToken,
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};
