import React, { useEffect, useState } from "react";

import { bakendUrl } from "../App";
import { toast } from "react-toastify";
import { currency } from "../App.jsx";

import axios from "axios";
import { data } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(bakendUrl + "/api/product/list");

      console.log(response.data);

      if (response.data.success) {
        toast.success("Products Loaded Successfully!");
        setList(response.data.products);
      } else {
        toast.error("No Products Found!");
      }
    } catch (error) {
      console.log("Error in Listing Products");

      toast.error(error.message);
    }
  };
  console.log(list);

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${bakendUrl}/api/product/remove?id=${id}`,
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchList();
      } else {
        toast.error("Not Deleted!");
      }
    } catch (error) {
      console.log("Error in Removing Products");

      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // useEffect(() => {
  //   console.log(list);
  // }, [list]);

  return (
    <>
      <p className="mb-2">All Products List</p>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {list.length === 0 ? (
          <p>No products found</p>
        ) : (
          list.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm "
            >
              <img src={item.image[0]} alt="" className="w-12" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}.00
              </p>
              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                X
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default List;
