import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, currency, token, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        let allOrderItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrderItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrderItem.reverse());
      }
    } catch (error) {
      toast.error(error.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f6f7fb] pt-20 px-4 md:px-10 font-sans">
      {/* Header */}
      <div className="mb-10">
        <Title text1={"ORDER"} text2={"JOURNEY"} />
        <p className="text-sm text-gray-500 mt-1 tracking-wide">
          Every purchase, beautifully tracked
        </p>
      </div>

      {/* EMPTY STATE */}
      {orderData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6 text-3xl">
            🛒
          </div>

          <h2 className="text-xl font-semibold text-gray-800">No orders yet</h2>

          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Looks like you haven’t placed any orders yet. Start shopping and
            your orders will appear here.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-7 py-3 rounded-xl
            bg-gradient-to-r from-indigo-600 to-purple-600
            text-white font-semibold text-sm
            hover:scale-105 transition-transform"
          >
            Shop Now
          </button>
        </div>
      ) : (
        /* ORDERS TIMELINE */
        <div className="relative space-y-8">
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/40 to-transparent"></div>

          {orderData.map((item, index) => (
            <div key={index} className="relative group pl-16">
              {/* Timeline Dot */}
              <div
                className="absolute left-4 top-6 w-5 h-5 rounded-full 
                bg-white border-4 border-indigo-500
                transition-transform group-hover:scale-110"
              ></div>

              {/* Card */}
              <div
                className="bg-white rounded-2xl p-5 md:p-6
                border border-gray-200 shadow-sm
                hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-5">
                  {/* Product Info */}
                  <div className="flex gap-4">
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-20 h-24 rounded-xl object-cover"
                    />

                    <div>
                      <p className="font-semibold tracking-tight text-[15px] md:text-base text-gray-900">
                        {item.name}
                      </p>

                      <div className="flex gap-3 mt-1 text-sm text-gray-600">
                        <span className="text-indigo-600 font-semibold">
                          {currency}
                          {item.price}
                        </span>
                        <span>Qty {item.quantity}</span>
                        <span>Size {item.size}</span>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.date).toDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex md:flex-col md:items-end justify-between gap-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold
                      bg-indigo-50 text-indigo-700"
                    >
                      {item.status}
                    </span>

                    <button
                      onClick={loadOrderData}
                      className="text-sm font-medium px-5 py-2 rounded-lg
                      bg-gray-900 text-white
                      hover:bg-indigo-600 transition-colors"
                    >
                      Track Order
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs">
                  <span className="text-[13px] font-semibold text-gray-800">
                    Payment:
                    <span className="ml-1 font-bold">{item.paymentMethod}</span>
                  </span>

                  <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition">
                    View details →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
