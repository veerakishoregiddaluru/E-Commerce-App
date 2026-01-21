import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    setToken("");
    toast.success("Logout successfully ✅", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <>
      {/* LOGO ZOOM ANIMATION */}
      <style>
        {`
          @keyframes logoPulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
          .logo-animate {
            animation: logoPulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="flex items-center justify-between px-4 sm:px-[4%] py-3 border-b bg-white sticky top-0 z-40">
        {/* LOGO */}
        <img
          src={assets.kishore_trends1}
          alt="Logo"
          className="
            w-[72px] h-[72px]        /* Mobile */
            sm:w-[88px] sm:h-[88px]  /* Small screens */
            md:w-[104px] md:h-[104px]/* Tablets */
            lg:w-[128px] lg:h-[128px]/* Laptops */
            xl:w-[144px] xl:h-[144px]/* Large screens */
            object-contain
            rounded-2xl
            logo-animate
          "
        />

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="
            rounded-full
            bg-gray-700
            px-4 py-2
            text-xs sm:text-sm
            text-white
            hover:bg-gray-800
            transition
          "
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Navbar;
