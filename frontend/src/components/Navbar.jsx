import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

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
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
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
              transform: scale(1.3);
            }
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
            <div className="flex items-center gap-2">
              <img
                src={assets.kishore_trends1}
                alt="Kishore Trends Logo"
                className="
                  w-16 h-16
                  sm:w-18 sm:h-18
                  md:w-[88px] md:h-[88px]
                  lg:w-[112px] lg:h-[112px]
                  xl:w-[120px] xl:h-[120px]
                  object-contain
                  rounded-2xl
                  logo-animate
                "
              />
            </div>
          </NavLink>

          {/* DESKTOP MENU */}
          <ul className="hidden sm:flex gap-6 lg:gap-10 text-sm lg:text-base text-gray-700">
            {["Home", "Collection", "About", "Contact"].map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative group"
              >
                <p className="py-1">{item}</p>
                <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
              </NavLink>
            ))}
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

            {/* MOBILE MENU ICON */}
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
          className={`fixed top-0 right-0 bottom-0 bg-white z-50 overflow-hidden transition-all duration-300 ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-700">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-3 p-4 border-b"
            >
              <img src={assets.back_icon} className="h-4" />
              <p className="font-medium">Back</p>
            </div>

            {["Home", "Collection", "About", "Contact"].map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="py-4 pl-6 border-b text-base"
                onClick={() => setVisible(false)}
              >
                {item}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
