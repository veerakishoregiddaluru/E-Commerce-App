import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// Global variables
const currency = "inr";
const deliveryCharge = 10;

// Payment gateways
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================
   PLACE ORDER (COD)
========================= */
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // ✅ FIX

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

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

/* =========================
   PLACE ORDER (STRIPE)
========================= */
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // ✅ FIX
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
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
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

/* =========================
   VERIFY STRIPE
========================= */
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    const userId = req.userId; // ✅ FIX

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
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

/* =========================
   PLACE ORDER (RAZORPAY)
========================= */
const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // ✅ FIX

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

    res.status(200).send({
      success: true,
      message: "Order Placed through Razorpay",
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).send({
      success: false,
      message: "Error Occurred in Razorpay",
    });
  }
};

/* =========================
   VERIFY RAZORPAY
========================= */
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const userId = req.userId; // ✅ FIX

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.status(200).send({
        success: true,
        message: "Payment Successful",
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
      message: "Error Occurred in Razorpay Verification!",
    });
  }
};

/* =========================
   ADMIN: ALL ORDERS
========================= */
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "All Orders",
      orders,
    });
  } catch (error) {
    console.error("Error in Fetching Orders", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

/* =========================
   USER ORDERS
========================= */
const userOrder = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIX

    const orders = await orderModel.find({ userId });

    res.status(200).send({
      success: true,
      message: "User Orders",
      orders,
    });
  } catch (error) {
    console.error("Error in Fetching User Orders", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

/* =========================
   UPDATE ORDER STATUS
========================= */
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.status(200).send({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.error("Error in Updating Order Status", error);
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
  verifyStripe,
  verifyRazorpay,
  allOrders,
  userOrder,
  updateStatus,
};
