import { v2 as cloudinary } from "cloudinary";

import productModel from "../models/productModel.js";
// Function for Add Product

const addProduct = async (req, res) => {
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
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    console.log(
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller
    );

    console.log(imageUrl);

    const productData = {
      name,
      description,
      category,
      subCategory,
      price,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imageUrl,
      date: Date.now(),
    };

    console.log(productData);
    const product = new productModel(productData);
    await product.save();

    res.status(200).send({
      status: true,
      message: "Products Uploaded Successfully!",
      product: product,
    });
  } catch (error) {
    console.error("Error in User Registration", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

// Function for List Products

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});

    if (!listProducts) {
      return res.status(404).send({
        status: false,
        message: "Products Does not exist!",
      });
    }

    res.status(200).send({
      success: true,
      message: "List of Products",
      products: products,
    });
  } catch (error) {
    console.error("Error in User Registration", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

// Function for Remove Products

const removeProduct = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404).send({
        status: false,
        message: "ID Required!",
      });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        status: false,
        message: "Product Doest not Exist!",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Product Removed Successfully!",
      deletedProduct,
    });
  } catch (error) {
    console.error("Error in User Registration", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

//Function for single Product

const sigleProduct = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404).send({
        status: false,
        message: "ID Required!",
      });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        status: false,
        message: "Product Doest not Exist!",
      });
    }

    res.status(200).send({
      status: true,
      message: "Product Found!",
      product,
    });
  } catch (error) {
    console.error("Error in User Registration", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

export { addProduct, listProducts, removeProduct, sigleProduct };
