import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setMail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (response.data.status) {
          toast.success(response.data.message);
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (response.data.status) {
          toast.success(response.data.message);
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Error Occured");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      {/* Smaller Gradient Background */}
      <div className="w-full max-w-4xl rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 sm:p-10">
        {/* Card */}
        <form
          onSubmit={onSubmitHandler}
          className="mx-auto w-full max-w-xs sm:max-w-sm
          bg-white/90 backdrop-blur-xl
          rounded-2xl
          shadow-[0_25px_60px_rgba(0,0,0,0.25)]
          px-5 sm:px-6
          py-6 sm:py-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {currentState}
            </h1>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm">
              Welcome back, please enter your details
            </p>
          </div>

          {/* Name */}
          {currentState === "Sign Up" && (
            <div className="relative mb-4">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                className="peer w-full px-3 pt-4 pb-2
                rounded-lg border border-gray-300
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200
                outline-none transition"
              />
              <label
                className="absolute left-3 top-3 text-gray-400 text-xs transition-all
              peer-focus:text-[10px] peer-focus:-top-1 peer-focus:text-indigo-600
              peer-valid:text-[10px] peer-valid:-top-1"
              >
                Full Name
              </label>
            </div>
          )}

          {/* Email */}
          <div className="relative mb-4">
            <input
              onChange={(e) => setMail(e.target.value)}
              value={email}
              type="email"
              required
              className="peer w-full px-3 pt-4 pb-2
              rounded-lg border border-gray-300
              focus:border-purple-500 focus:ring-1 focus:ring-purple-200
              outline-none transition"
            />
            <label
              className="absolute left-3 top-3 text-gray-400 text-xs transition-all
            peer-focus:text-[10px] peer-focus:-top-1 peer-focus:text-purple-600
            peer-valid:text-[10px] peer-valid:-top-1"
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              className="peer w-full px-3 pt-4 pb-2
              rounded-lg border border-gray-300
              focus:border-pink-500 focus:ring-1 focus:ring-pink-200
              outline-none transition"
            />
            <label
              className="absolute left-3 top-3 text-gray-400 text-xs transition-all
            peer-focus:text-[10px] peer-focus:-top-1 peer-focus:text-pink-600
            peer-valid:text-[10px] peer-valid:-top-1"
            >
              Password
            </label>
          </div>

          {/* Links */}
          <div className="flex justify-between text-[11px] text-gray-600 mb-5">
            <p className="hover:text-indigo-600 cursor-pointer text-black">
              Forgot Password?
            </p>

            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="hover:text-purple-600 cursor-pointer font-semibold"
              >
                Create Account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState("Login")}
                className="hover:text-purple-600 cursor-pointer font-semibold"
              >
                Login Here
              </p>
            )}
          </div>

          {/* Button */}
          <button
            className="w-full py-2.5
            rounded-lg
            text-white text-sm font-semibold
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
            shadow-[0_15px_35px_rgba(0,0,0,0.3)]
            hover:scale-[1.02] active:scale-[0.96]
            transition-all duration-200"
          >
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
