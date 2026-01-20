import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  address: {
    type: Object, // ✅ FIXED
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true },

  date: { type: Number, required: true },
});

const ordermodel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default ordermodel;
