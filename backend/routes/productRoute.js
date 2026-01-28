import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";
import upload from "../middleWares/multer.js";
import adminAuth from "../middleWares/adminAuth.js";

const router = express.Router();

router.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
  ]),
  addProduct,
);

router.get("/list", listProducts);
router.get("/single-product", singleProduct);
router.delete("/remove", adminAuth, removeProduct);

export default router;
