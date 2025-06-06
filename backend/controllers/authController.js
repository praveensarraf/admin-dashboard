import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Something is missing!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully!",
      user,
      success: true,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const emailError = err.errors.email?.message;
      if (emailError) {
        return res.status(400).json({ message: emailError });
      }
      return res.status(400).json({ message: 'Validation failed!' });
    }

    res.status(500).json({ message: 'Server error!' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect Email or Password!",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({
        message: `Welcome back, ${user.name}!`,
        user,
        success: true,
      });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const emailError = err.errors.email?.message;
      if (emailError) {
        return res.status(400).json({ message: emailError });
      }
      return res.status(400).json({ message: 'Validation failed!' });
    }

    res.status(500).json({ message: 'Server error!' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", {
        sameSite: "None",
        secure: true,
      })
      .json({
        message: "Logged out successfully. Goodbye!",
        success: true,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
};



export const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized!" });
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!" });
  }
};
