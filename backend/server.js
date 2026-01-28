import "./config/env.js";

import express from "express";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

await connectDB();
connectCloudinary();

app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/user", userRouter); 
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ ONLY listen locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log("Server running locally on PORT", PORT));
}

export default app;
