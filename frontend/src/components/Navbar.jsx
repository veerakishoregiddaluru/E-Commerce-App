import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
// ✅ Premium Heroicons (Outline)
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineInformationCircle,
  HiOutlinePhone,
} from "react-icons/hi2";

const navItems = [
  { name: "Home", path: "/", icon: HiOutlineHome },
  { name: "Collection", path: "/collection", icon: HiOutlineShoppingBag },
  { name: "About", path: "/about", icon: HiOutlineInformationCircle },
  { name: "Contact", path: "/contact", icon: HiOutlinePhone },
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logOut = () => {
    toast.success("User Logout Successfully!");
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <>
      {/* LOGO ANIMATION */}
      <style>
        {`
          @keyframes logoPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          .logo-animate {
            animation: logoPulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3 sm:py-4 lg:py-5 font-medium">
          {/* LOGO */}
          <NavLink to="/">
            <img
              src={assets.kishore_trends1}
              alt="Kishore Trends Logo"
              className="
                w-16 h-16
                sm:w-20 sm:h-20
                md:w-[90px] md:h-[90px]
                lg:w-[110px] lg:h-[110px]
                object-contain rounded-2xl logo-animate
              "
            />
          </NavLink>

          {/* DESKTOP MENU (ICON TOP, TEXT BELOW) */}
          <ul className="hidden sm:flex gap-10 lg:gap-14">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="group flex flex-col items-center text-gray-700"
                >
                  <Icon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300" />
                  <span className="text-sm mt-1 font-medium tracking-wide">
                    {item.name}
                  </span>
                  <span className="mt-1 h-[2px] w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              );
            })}
          </ul>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4 sm:gap-5 lg:gap-7">
            {/* SEARCH */}
            <img
              onClick={() => setShowSearch(true)}
              src={assets.search_icon}
              className="w-5 sm:w-6 lg:w-7 cursor-pointer"
              alt="Search"
            />

            {/* PROFILE */}
            <div className="group relative">
              <img
                onClick={() => (token ? null : navigate("/login"))}
                src={assets.profile_icon}
                className="w-7 sm:w-8 lg:w-9 cursor-pointer"
                alt="Profile"
              />

              {token && (
                <div className="absolute right-0 pt-3 hidden group-hover:block">
                  <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-white text-gray-600 rounded-xl shadow-lg">
                    <p
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer hover:text-black"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer hover:text-black"
                    >
                      Orders
                    </p>
                    <p
                      onClick={logOut}
                      className="cursor-pointer hover:text-black"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CART */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon1}
                className="w-6 sm:w-7 lg:w-8"
                alt="Cart"
              />
              <p className="absolute -right-2 -top-1 min-w-[16px] h-[16px] px-[4px] flex items-center justify-center bg-red-600 text-white rounded-full text-[10px]">
                {getCartCount()}
              </p>
            </Link>

            {/* MOBILE MENU */}
            <img
              src={assets.menu_icon}
              onClick={() => setVisible(true)}
              className="w-6 cursor-pointer sm:hidden"
              alt="Menu"
            />
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        <div
          className={`fixed top-0 right-0 bottom-0 bg-white z-50 transition-all duration-300 ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-700">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-3 p-4 border-b"
            >
              <img src={assets.back_icon} className="h-4" alt="Back" />
              <p className="font-medium">Back</p>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="py-4 pl-6 border-b text-base flex items-center gap-4"
                  onClick={() => setVisible(false)}
                >
                  <Icon className="w-5 h-5 text-indigo-600" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
