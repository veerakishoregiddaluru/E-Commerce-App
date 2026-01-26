import express from "express";
import {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrder,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
} from "../controllers/orderController.js";
import adminAuth from "../middleWares/adminAuth.js";
import authUser from "../middleWares/auth.js";

const orderRouter = express.Router();

//Admin Feature
orderRouter.post("/all", adminAuth, allOrders);

orderRouter.post("/status", adminAuth, updateStatus);

//Payment Features

orderRouter.post("/place", authUser, placeOrder);

orderRouter.post("/stripe", authUser, placeOrderStripe);
//Verify Payment
orderRouter.post("/verifyStripe", verifyStripe);

orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
// User Feature

orderRouter.post("/userorders", authUser, userOrder);
export default orderRouter;
