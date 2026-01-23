import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Profile = () => {
  const {
    token,
    navigate,
    setToken,
    setCartItems,
    getUserProfile,
    backendUrl,
  } = useContext(ShopContext);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileAndOrders = async () => {
      const userData = await getUserProfile();
      setUser(userData);

      try {
        const res = await axios.post(
          backendUrl + "/api/order/userorders",
          {},
          { headers: { token } },
        );

        if (res.data.success) {
          setOrders(res.data.orders.reverse() || []);
        }
      } catch (error) {
        console.error("Failed to load orders");
      }

      setLoading(false);
    };

    fetchProfileAndOrders();
  }, [token]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.name?.charAt(0)}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Joined on{" "}
              {user.createdAt ? new Date(user.createdAt).toDateString() : "N/A"}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="bg-indigo-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-indigo-600">{orders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Orders</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-green-600">Active</p>
            <p className="text-xs text-gray-500 mt-1">Status</p>
          </div>

          <div className="bg-pink-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-pink-600">User</p>
            <p className="text-xs text-gray-500 mt-1">Role</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-yellow-600">India</p>
            <p className="text-xs text-gray-500 mt-1">Region</p>
          </div>
        </div>

        {/* ================= ORDERS (PREMIUM UI) ================= */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            My Orders
          </h3>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No orders yet
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Gradient accent */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-pink-500" />

                  <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* LEFT */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.createdAt || order.date
                          ? new Date(
                              order.createdAt || order.date,
                            ).toDateString()
                          : "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment:{" "}
                        <span className="font-medium text-gray-700">
                          {order.paymentMethod || "N/A"}
                        </span>
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        ₹{order.amount || order.totalAmount || 0}
                      </p>

                      <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600 font-medium">
                        {order.status || "Processing"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => navigate("/update-profile")}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow"
          >
            Edit Profile
          </button>

          <button
            onClick={logoutHandler}
            className="flex-1 py-3 rounded-xl border border-red-400 text-red-500 font-medium hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
