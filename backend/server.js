// MUST be first
import "./config/dotenv.js";

import express from "express";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ serverless-safe initialization
let isConnected = false;
app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      connectCloudinary();
      isConnected = true;
    }
    next();
  } catch (err) {
    console.error("Init error:", err.message);
    res.status(500).json({ message: "Server init failed" });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("API working 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

export default app;
