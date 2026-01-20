import express from "express";
import {
  addToCart,
  getUser,
  updateCart,
} from "../controllers/cartController.js";
import authUser from "../middleWares/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/update", authUser, updateCart);
cartRouter.post("/get", authUser, getUser);

export default cartRouter;
