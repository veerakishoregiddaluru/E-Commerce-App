import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import {
  sendOrderSuccessWhatsApp,
  sendOrderStatusWhatsApp,
} from "../utils/sendWhatsApp.js";

// ================= CONFIG =================
const currency = "inr";
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= HELPER =================
const enrichItemsWithImage = async (items) => {
  return await Promise.all(
    items.map(async (item) => {
      const product = await productModel.findOne({ name: item.name });
      return {
        ...item,
        productId: product?._id,
        image: product?.image || [],
      };
    }),
  );
};

/* =========================
   PLACE ORDER (COD)
========================= */
const placeOrder = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      address: req.body.address,
      amount: req.body.amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // ✅ WhatsApp Message
    sendOrderSuccessWhatsApp({
      userPhone: user.phone,
      userName: user.name,
      orderId: newOrder._id,
      amount: newOrder.amount,
      paymentMethod: "Cash on Delivery",
    });

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

/* =========================
   PLACE ORDER (STRIPE)
========================= */
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    const enrichedItems = await enrichItemsWithImage(items);

    const newOrder = await orderModel.create({
      userId,
      items: enrichedItems,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: newOrder._id.toString(),
      success_url: `${origin}/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      line_items,
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Stripe session creation failed",
    });
  }
};

/* =========================
   VERIFY STRIPE
========================= */
const verifyStripe = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "Session ID missing",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const orderId = session.client_reference_id;

      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true, status: "Order Placed" },
        { new: true },
      );

      const user = await userModel.findById(order.userId);

      // ✅ WhatsApp Message
      sendOrderSuccessWhatsApp({
        userPhone: user.phone,
        userName: user.name,
        orderId: order._id,
        amount: order.amount,
        paymentMethod: "Stripe",
      });

      return res.status(200).json({
        success: true,
        message: "Stripe payment verified",
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment not completed",
    });
  } catch (error) {
    console.error("Stripe verify error:", error.message);
    res.status(500).json({
      success: false,
      message: "Stripe verification failed",
    });
  }
};

/* =========================
   PLACE ORDER (RAZORPAY)
========================= */
const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const enrichedItems = await enrichItemsWithImage(items);

    const newOrder = await orderModel.create({
      userId,
      items: enrichedItems,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

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

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const order = await orderModel.findByIdAndUpdate(
        orderInfo.receipt,
        { payment: true, status: "Order Placed" },
        { new: true },
      );

      const user = await userModel.findById(order.userId);

      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      // ✅ WhatsApp Message
      sendOrderSuccessWhatsApp({
        userPhone: user.phone,
        userName: user.name,
        orderId: order._id,
        amount: order.amount,
        paymentMethod: "Razorpay",
      });

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
    res.status(500).send({
      success: false,
      message: "Razorpay Verification Error!",
    });
  }
};

/* =========================
   ADMIN & USER
========================= */
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({ success: true, orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // 1️⃣ Update order status
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 2️⃣ Send WhatsApp safely (must NOT break status update)
    try {
      const user = await userModel.findById(order.userId);

      if (user?.phone) {
        await sendOrderStatusWhatsApp({
          phone: user.phone,
          name: user.name,
          orderId: order._id,
          status,
        });
      }
    } catch (whatsAppError) {
      console.error("⚠️ WhatsApp failed (ignored):", whatsAppError.message);
    }

    // 3️⃣ Always succeed if DB update worked
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripe,
  verifyRazorpay,
  allOrders,
  userOrder,
  updateStatus,
};
