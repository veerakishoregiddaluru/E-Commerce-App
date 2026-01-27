import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const descriptions = [
  "Discover trends that match your vibe.",
  "Style that speaks louder than words.",
  "Fresh fashion, just for you.",
  "Upgrade your wardrobe today.",
  "Where comfort meets style.",
];

const Welcome = () => {
  const navigate = useNavigate();

  const randomText =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  const handleContinue = () => {
    navigate("/", { replace: true });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-[#0f0f0f]"
    >
      {/* ✨ Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* 💎 Main Card */}
      <div
        className="relative z-10 w-full max-w-6xl mx-4 grid grid-cols-1 md:grid-cols-2
        rounded-3xl overflow-hidden
        bg-white/10 backdrop-blur-2xl border border-white/20
        shadow-[0_40px_120px_rgba(0,0,0,0.6)]
        animate-[fadeUp_1s_ease-out]"
      >
        {/* 🖼️ Brand Image */}
        <div className="relative group overflow-hidden">
          <img
            src={assets.kishore_trends1}
            alt="Kishore Trends"
            className="w-full h-full object-cover
              scale-105 group-hover:scale-110
              transition-transform duration-700 ease-out"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />

          {/* Floating badge */}
          <div
            className="absolute bottom-6 left-6 px-4 py-2 rounded-full
            bg-white/20 backdrop-blur-lg border border-white/30
            text-white text-sm tracking-wide shadow-lg"
          >
            ✨ Premium Fashion Store
          </div>
        </div>

        {/* 📝 Content */}
        <div className="flex flex-col justify-center p-10 sm:p-14 text-center md:text-left">
          {/* Icon */}
          <div
            className="mb-6 inline-flex items-center justify-center w-20 h-20
            rounded-full bg-gradient-to-br from-pink-500 to-purple-600
            shadow-[0_15px_40px_rgba(0,0,0,0.6)]
            animate-float"
          >
            <span className="text-4xl">🛍️</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            Welcome to <br />
            <span
              className="bg-clip-text text-transparent
              bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
            >
              Kishore Trends
            </span>
          </h1>

          <p className="text-white/80 text-lg mb-10 max-w-md">{randomText}</p>

          <button
            onClick={handleContinue}
            className="relative inline-flex items-center gap-3
    px-8 py-4 text-lg font-semibold text-white rounded-full
    bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500
    shadow-[0_20px_50px_rgba(168,85,247,0.55)]
    transition-all duration-300
    hover:scale-105 hover:shadow-[0_30px_70px_rgba(236,72,153,0.65)]
    active:scale-95"
          >
            Continue Shopping
            <span className="text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* 🎞️ Animations */}
      <style>
        {`
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;
