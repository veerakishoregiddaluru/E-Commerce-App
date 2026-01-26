import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"; // ✅ REQUIRED
import Stripe from "stripe";
import Razorpay from "razorpay";

// ================= CONFIG =================
const currency = "inr";
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const enrichItemsWithImage = async (items) => {
  return await Promise.all(
    items.map(async (item) => {
      const product = await productModel.findOne({
        name: item.name, // fallback
      });

      return {
        ...item,
        productId: product?._id, // ✅ attach it now
        image: product?.image || [],
      };
    }),
  );
};
console.log(enrichItemsWithImage);

/* =========================
   PLACE ORDER (COD)
========================= */
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.userId, // comes from auth middleware
      items: req.body.items,
      address: req.body.address,
      amount: req.body.amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();

    // clear cart
    await userModel.findByIdAndUpdate(req.userId, {
      cartData: {},
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
        currency,
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
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
    console.error("Stripe Order Error:", error);
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
    const userId = req.userId;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.status(200).send({ success: true, message: "Stripe Verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).send({ success: false, message: "Stripe Not Verified!" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error!" });
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
    const userId = req.userId;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.status(200).send({ success: true, message: "Payment Successful" });
    } else {
      res.status(400).send({ success: false, message: "Payment Failed!" });
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
  const orders = await orderModel.find({});
  res.status(200).send({ success: true, orders });
};

const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.userId,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("USER ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const updateStatus = async (req, res) => {
  await orderModel.findByIdAndUpdate(req.body.orderId, {
    status: req.body.status,
  });
  res.status(200).send({ success: true, message: "Status Updated" });
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
