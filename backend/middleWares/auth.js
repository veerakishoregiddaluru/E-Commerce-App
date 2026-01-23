import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  console.log("token from headers", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 fetch user and attach it
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // REQUIRED for profile
    req.userId = user._id; // optional (cart, orders)

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid Tokens",
    });
  }
};

export default authUser;
