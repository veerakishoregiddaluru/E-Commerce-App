import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setMail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const url =
        currentState === "Sign Up"
          ? backendUrl + "/api/user/register"
          : backendUrl + "/api/user/login";

      const payload =
        currentState === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const response = await axios.post(url, payload);

      if (response.data.status) {
        toast.success(response.data.message);

        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // safe userId storage
        if (response.data.user?._id) {
          localStorage.setItem("userId", response.data.user._id);
        }

        // ✅ ALWAYS GO TO WELCOME AFTER LOGIN
        navigate("/welcome", { replace: true });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/welcome", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 sm:p-10">
        <form
          onSubmit={onSubmitHandler}
          className="mx-auto w-full max-w-xs sm:max-w-sm bg-white/90 backdrop-blur-xl
          rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] px-5 sm:px-6 py-6 sm:py-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {currentState}
            </h1>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm">
              Welcome back, please enter your details
            </p>
          </div>

          {currentState === "Sign Up" && (
            <input
              className="mb-4 w-full px-3 py-2 border rounded"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="mb-4 w-full px-3 py-2 border rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setMail(e.target.value)}
          />

          <input
            className="mb-4 w-full px-3 py-2 border rounded"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-2 bg-black text-white rounded">
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>

          <p
            onClick={() =>
              setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
            }
            className="mt-4 text-center text-sm cursor-pointer"
          >
            {currentState === "Login" ? "Create Account" : "Login Here"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
