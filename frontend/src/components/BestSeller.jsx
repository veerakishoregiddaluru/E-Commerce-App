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
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLER"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis
          laboriosam pariatur expedita, vel dicta magnam corrupti optio qui
          animi, soluta et omnis hic quidem facere minima saepe atque
          perferendis. Illum.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
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
