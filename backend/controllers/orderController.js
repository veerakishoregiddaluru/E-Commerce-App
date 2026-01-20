// import { currency } from "../../admin/src/App.jsx";
import ordermodel from "../models/orderModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
// import mongoose from "mongoose";
import Stripe from "stripe";

import Razorpay from "razorpay";

// global Variables

const currency = "inr";
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log(process.env.RAZORPAY_KEY_ID);
console.log(process.env.RAZORPAY_KEY_SECRET, "Secret or Razorpay");

// Placing Order Through COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    console.log("user Id" + userId);
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log("order Data", orderData);

    res.status(200).send({
      success: true,
      message: "Order Placed",
    });
  } catch (error) {
    console.error("Error in Placing order!", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
// Placing Order Through Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          // ✅ CORRECT KEY
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // paise
      },
      quantity: item.quantity,
    }));

    // Delivery charge
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          // ✅ CORRECT KEY
          name: "Delivery Charges",
        },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.status(200).send({
      success: true,
      message: "Stripe Payment Session Created",
      success_url: session.url,
    });
  } catch (error) {
    console.error("Error in Placing order!", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await ordermodel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.status(200).send({
        success: true,
        message: "Stripe Verified",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).send({
        success: false,
        message: "Stripe Not Verified!",
      });
    }
  } catch (error) {
    console.error("Error in Verifying Stripe order!", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Placing Order Through Razorpay

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).send({
      success: true,
      message: "Order Placed through Razorpay",
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).send({
      success: false,
      message: "Error Occured in Razorpay",
    });
  }
};

// Verify Razorpay

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.status(200).send({
        success: true,
        message: "Payment Successfull",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Payment Failed!",
      });
    }
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).send({
      success: false,
      message: "Error Occured in Razorpay Verification!",
    });
  }
};

//All Order data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      status: true,
      message: "All Orders",
      orders,
    });
  } catch (error) {
    console.error("Error in Fetching Orders", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

// User Order Data for Front End
const userOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orders = await orderModel.find({
      // userId: new mongoose.Types.ObjectId(userId),
      userId,
    });
    console.log("User Orders", orders);

    res.status(200).send({
      success: true,
      message: "User Orders",
      orders,
    });
  } catch (error) {
    console.error("Error in Placing order!", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

//Update user Order  From Status

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.status(200).send({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.error("Error in Placing order!", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrder,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};
