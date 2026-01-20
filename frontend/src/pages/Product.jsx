import React, { use, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");

  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);

        setImage(item.image[0]);
        // console.log(item);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/** Product Image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row ">
          <div className="flex sm:flex-col overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-50" alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-5 5" alt="" />
            <img src={assets.star_icon} className="w-5 5" alt="" />
            <img src={assets.star_icon} className="w-5 5" alt="" />
            <img src={assets.star_dull_icon} className="w-4 5" alt="" />
            <img src={assets.star_dull_icon} className="w-4 5" alt="" />
            <p className="pl-2">(210)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency} {productData.price}.00
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            onClick={() => addToCart(productData._id, size)}
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery availble on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description and Review Section */}
      <div className="mt-20">
        <div className="flex">
          <div className="border px-5 py-3 text-sm  text-black">
            Description
          </div>
          <p className="border px-5 py-3 text-sm">Reviews</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce application is an online platform that allows users to
            browse products, view detailed information, select sizes or
            variants, add items to a cart, and purchase products securely from
            anywhere. The app provides a smooth and user-friendly shopping
            experience with real-time product updates, search functionality, and
            secure payment options.
          </p>
          <p>
            This e-commerce app enables users to explore a wide range of
            products, view details, choose sizes, and place orders easily. It
            offers a responsive design, fast navigation, and a seamless shopping
            experience from product selection to checkout.
          </p>
        </div>
      </div>
      {/* Display Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
