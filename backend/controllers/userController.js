import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// ================= CREATE TOKEN =================
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

console.log("create Token", createToken());

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    //  User not found
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    //  Wrong password
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Success
    const token = createToken(user._id);

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //  User already exists
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists",
      });
    }

    //  Invalid email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Please enter a valid email",
      });
    }

    //  Weak password
    if (password.length < 8) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 8 characters",
      });
    }

    // ✅ Hash password (FIXED bcrypt usage)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ================= ADMIN LOGIN =================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // 🔥 include isAdmin flag
      const token = jwt.sign(
        {
          email,
          isAdmin: true, // ✅ REQUIRED
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      return res.status(200).json({
        success: true,
        message: "Admin access granted",
        token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    console.error("Admin login error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= USER PROFILE =================
export const getUserProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export { loginUser, registerUser, adminLogin };
