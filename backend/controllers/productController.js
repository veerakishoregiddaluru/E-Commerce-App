import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

/* ADD PRODUCT */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const images = Object.values(req.files || {})
      .flat()
      .map((f) => f.path);

    const imageUrls = await Promise.all(
      images.map((path) =>
        cloudinary.uploader.upload(path).then((r) => r.secure_url),
      ),
    );

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      image: imageUrls,
      date: Date.now(),
    });

    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Add product failed" });
  }
};

/* LIST PRODUCTS */
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* REMOVE PRODUCT */
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.query.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* SINGLE PRODUCT */
export const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.query.id);
    res.json({ success: true, product });
  } catch {
    res.status(404).json({ success: false });
  }
};
