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
    <div className="flex items-center justify-between py-5 font-medium">
      <NavLink to="/">
        <div className="flex gap-2">
          <img
            src={assets.kishore_logo}
            alt="Logo"
            className="w-19 h-20 object-contain rounded-xl  "
          />
          <img
            src={assets.e_logo2}
            alt="Logo"
            className="w-19 h-20 object-contain rounded-xl  "
          />
        </div>
      </NavLink>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700 ">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>Collection</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-7">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-7 cursor-pointer"
        ></img>
        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-10 cursor-pointer"
          ></img>
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36  py-3 px-5 bg-slate-100  text-gray-500 rounded">
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
                <p onClick={logOut} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon1}
            className="w-9 min-w-5"
            alt="Cart Icon"
          ></img>
          <p className="absolute right-[-1px] bottom-[4px] w-4 text-center leading-4 bg-red-600 text-white aspect-square rounded-full text-[9px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          src={assets.menu_icon}
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden"
        ></img>
      </div>
      <div
        className={`absolute top-0 right-0  bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-2 p-3"
          >
            <img src={assets.back_icon} className="h-4 rotate-10" />
            <p>Back</p>
          </div>
          <NavLink
            to="/"
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/collection"
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
          >
            Collection
          </NavLink>
          <NavLink
            to="/about"
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
