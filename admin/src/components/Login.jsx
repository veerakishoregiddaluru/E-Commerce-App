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

      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
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
            50% { transform: scale(1.15); }
          }
          .zoom-animate {
            animation: zoomInOut 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* LEFT BRANDING – DESKTOP */}
          <div className="hidden md:flex flex-col items-center justify-center bg-slate-900 text-white p-8">
            <div className="relative mb-6">
              {/* BAG HANDLE */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-16 border-4 border-white rounded-t-full"></div>

              {/* BAG BODY */}
              <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <img
                  src={assets.kishore_trends1}
                  alt="Kishore Trends Logo"
                  className="w-28 h-28 object-contain zoom-animate"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Kishore Trends</h2>
            <p className="text-slate-300 text-center">
              Secure Admin Panel <br />
              Fashion for Every Generation
            </p>
          </div>

          {/* RIGHT SIDE – LOGIN */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            {/* MOBILE BAG LOGO */}
            <div className="md:hidden flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {/* BAG HANDLE */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 border-4 border-black rounded-t-full"></div>

                {/* BAG BODY */}
                <div className="w-32 h-32 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                  <img
                    src={assets.kishore_trends1}
                    alt="Kishore Trends Logo"
                    className="w-20 h-20 object-contain zoom-animate"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-800">
                Kishore Trends
              </h2>
              <p className="text-sm text-slate-500 text-center mt-1">
                Secure Admin Panel <br />
                Fashion for Every Generation
              </p>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center md:text-left">
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
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-semibold transition-all"
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
