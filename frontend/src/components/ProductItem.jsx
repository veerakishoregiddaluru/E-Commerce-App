import { useContext } from "react";
import { ShopContext } from "../context/ShopContext"; // ✅ correct

import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const onclick = (e) => {
    e.preventDefault();
  };
  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer ">
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out "
          src={image[0]}
        ></img>
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="pt-3 pb-1 text-sm">
        {currency}
        {price}.00
      </p>
    </Link>
  );
};

export default ProductItem;
