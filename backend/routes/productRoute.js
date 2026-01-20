import express from "express";

import {
  addProduct,
  listProducts,
  removeProduct,
  sigleProduct,
} from "../controllers/productController.js";
import upload from "../middleWares/multer.js";
import { adminLogin } from "../controllers/userController.js";
import adminAuth from "../middleWares/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.get(
  "/list",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  listProducts
);
productRouter.delete("/remove", adminAuth, removeProduct);
productRouter.get("/single-product", sigleProduct);

productRouter.post("/admin-login", adminLogin);
export default productRouter;
