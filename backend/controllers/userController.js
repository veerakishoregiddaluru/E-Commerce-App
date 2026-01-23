import userModel from "../models/userModel.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
console.log(createToken);

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User Does Not Exist!",
      });
    }

    const isMatch = await bycrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);

      return res.status(200).send({
        status: true,
        message: "User Login Successfully!",
        token: token,
      });
    } else {
      return res.status(404).send({
        status: false,
        messsage: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.error("Error in User Registration", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(404).send({
        status: false,
        message: "User Already Exist!",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(404).send({
        status: false,
        message: "Please enter valid email!",
      });
    }

    if (password.length < 8) {
      return res.status(404).send({
        status: false,
        message: "Please enter strong password!",
      });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(201).send({
      status: true,
      message: "User Registered Successfully!",
      token: token,
    });
  } catch (error) {
    console.error("Error in User Registration", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.status(200).send({
        success: true,
        message: "Admin Access",
        token,
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.error("Error in Admin Login", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
export { loginUser, registerUser, adminLogin };
