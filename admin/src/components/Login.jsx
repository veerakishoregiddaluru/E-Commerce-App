import axios from "axios";
import { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      // ✅ CORRECT ADMIN LOGIN ENDPOINT
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        // ✅ SAVE ADMIN TOKEN PROPERLY
        localStorage.setItem("adminToken", response.data.token);
        setToken(response.data.token);

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <>
      {/* ZOOM ANIMATION */}
      <style>
        {`
          @keyframes zoomInOut {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.4); }
          }
          .zoom-animate {
            animation: zoomInOut 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="hidden md:flex flex-col items-center justify-center bg-slate-900 text-white p-8">
            <div className="relative mb-6">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-14 border-4 border-white rounded-t-full"></div>
              <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <img
                  src={assets.kishore_trends1}
                  alt="Kishore Trends Logo"
                  className="w-24 h-24 object-contain zoom-animate"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Kishore Trends</h2>
            <p className="text-slate-300 text-center">
              Secure Admin Panel <br />
              Fashion for Every Generation
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">
              Admin Login
            </h1>

            <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-semibold"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
