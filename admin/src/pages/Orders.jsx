import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { bakendUrl, currency } from "../App";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        bakendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );

      if (response.data.success || response.data.status) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        bakendUrl + "/api/order/status",
        {
          orderId,
          status: e.target.value,
        },
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <h3 className="mb-6 text-xl font-bold text-slate-800">📦 Orders</h3>

      {orders.length === 0 && <p className="text-gray-500">No orders found</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-5 shadow-sm hover:shadow-md transition flex flex-col gap-4 text-sm"
        >
          {/* ================= PRODUCTS ================= */}
          <div className="flex items-start gap-4">
            {/* PRODUCT IMAGES */}
            <div className="flex gap-2">
              {order.items.map((item, idx) => (
                <img
                  key={idx}
                  src={
                    Array.isArray(item.image) && item.image.length > 0
                      ? item.image[0]
                      : assets.parcel_icon
                  }
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border"
                />
              ))}
            </div>

            {/* PRODUCT DETAILS */}
            <div className="flex flex-col gap-1">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {item.name}
                  </span>{" "}
                  × {item.quantity}
                  <span className="ml-1 text-xs text-indigo-600 font-medium">
                    ({item.size})
                  </span>
                </p>
              ))}
            </div>
          </div>

          {/* ================= CUSTOMER ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="font-semibold text-slate-800">
              👤 {order.address.firstName} {order.address.lastName}
            </p>
            <p className="text-slate-500">📞 {order.address.phone}</p>
          </div>

          {/* ================= AMOUNT & PAYMENT ================= */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-bold text-emerald-600">
              {currency}
              {order.amount}
            </p>

            <div className="flex gap-3 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {order.paymentMethod}
              </span>

              <span
                className={`px-3 py-1 rounded-full ${
                  order.payment
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.payment ? "Payment Done" : "Payment Pending"}
              </span>
            </div>
          </div>

          {/* ================= STATUS ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">
              Order Status
            </label>
            <select
              value={order.status}
              onChange={(e) => statusHandler(e, order._id)}
              className="border rounded-xl px-3 py-2 text-sm font-semibold bg-slate-50 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-56"
            >
              <option>Order Placed</option>
              <option>Shipped</option>
              <option>Out for delivery</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
