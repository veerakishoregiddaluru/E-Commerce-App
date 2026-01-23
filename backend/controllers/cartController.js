import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;

    const user = await userModel.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    let cartData = user.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    await user.save();
    res.json({
      success: true,
      message: "Added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("Error in Add to Cart", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    await userData.save();
    res.status(201).send({
      success: true,
      message: "Cart Updated",
    });
  } catch (error) {
    console.error("Error in Add to Cart", error);
    res.status(500).send({
      success: false,
      message: "Internal Server!",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.userId;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.status(200).send({
      success: true,
      message: "Got User",
      cartData,
    });
  } catch (error) {}
};

export { addToCart, updateCart, getUser };
