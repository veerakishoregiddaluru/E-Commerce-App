import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const [bestseller, setBestSeller] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(5, 10));
  }, [products]);

  console.log(products);

  return (
    <div className="my-16 px-4 sm:px-6 lg:px-12">
      {/* HEADING */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-gray-900">
          <span className="text-gray-800">BEST</span>{" "}
          <span className="text-indigo-600">SELLER</span>
        </h2>

        <p
          className="
      mt-4
      max-w-2xl
      mx-auto
      text-sm sm:text-base
      text-gray-600
      leading-relaxed
    "
        >
          Discover our most-loved styles, handpicked by customers across all
          ages. From everyday essentials to standout fashion pieces, these best
          sellers define comfort, quality, and timeless design — made to elevate
          your wardrobe effortlessly.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div
        className="
    grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-4
    lg:grid-cols-5
    gap-5
    gap-y-8
  "
      >
        {bestseller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
