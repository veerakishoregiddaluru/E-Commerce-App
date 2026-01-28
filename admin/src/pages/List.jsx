import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        toast.success("Products Loaded Successfully!");
        setList(response.data.products);
      } else {
        toast.error("No Products Found!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/product/remove?id=${id}`,
        { headers: { token } },
      );

      if (response.data.success) {
        fetchList();
      } else {
        toast.error("Not Deleted!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <p className="mb-5 text-xl font-bold text-slate-800">📦 All Products</p>

      <div className="flex flex-col gap-4">
        {list.length === 0 ? (
          <p className="text-slate-500">No products found</p>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
              className="
            relative
            flex flex-col
            sm:grid sm:grid-cols-[90px_1fr_140px_100px]
            gap-4
            border border-slate-200
            p-4
            rounded-2xl
            bg-white
            shadow-sm
            hover:shadow-md
            transition
          "
            >
              {/* DELETE ICON */}
              <button
                onClick={() => removeProduct(item._id)}
                className="
              absolute top-3 right-3
              w-8 h-8
              flex items-center justify-center
              rounded-full
              bg-slate-100
              text-slate-400
              hover:bg-red-100
              hover:text-red-600
              text-sm
              font-bold
              transition
            "
                title="Delete product"
              >
                ✕
              </button>

              {/* IMAGE */}
              <div className="flex items-center justify-center">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="
                w-20 h-20
                object-contain
                rounded-xl
                bg-slate-50
                p-2
              "
                />
              </div>

              {/* NAME */}
              <div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Product Name</p>
              </div>

              {/* CATEGORY */}
              <div className="flex items-center">
                <span
                  className="
                inline-block
                px-3 py-1
                rounded-full
                text-xs
                font-medium
                bg-indigo-100
                text-indigo-700
              "
                >
                  {item.category}
                </span>
              </div>

              {/* PRICE */}
              <p className="text-lg font-bold text-emerald-600">
                {currency}
                {item.price}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
