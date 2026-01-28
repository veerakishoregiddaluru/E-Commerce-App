import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: [String],
  category: String,
  subCategory: String,
  sizes: [String],
  bestseller: Boolean,
  date: Number,
});

// 🔥 force correct collection
const productModel =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "products");

export default productModel;
