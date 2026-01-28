import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// ================= CREATE TOKEN =================

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

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
    const { name, email, password, phone } = req.body;

    // ✅ Check required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // ✅ User already exists
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists",
      });
    }

    // ✅ Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Please enter a valid email",
      });
    }

    // ✅ Validate phone (India – 10 digits)
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        status: false,
        message: "Please enter a valid 10-digit phone number",
      });
    }

    // ✅ Weak password check
    if (password.length < 8) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 8 characters",
      });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user WITH phone
    const user = await userModel.create({
      name,
      email,
      phone: cleanPhone,
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
