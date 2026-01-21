import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="
        fixed sm:sticky
        top-auto sm:top-0
        bottom-0 sm:bottom-auto
        h-auto sm:h-screen
        w-full sm:w-[18%]
        bg-white
        border-t sm:border-t-0
        sm:border-r
        z-30
      "
    >
      <div
        className="
          flex sm:flex-col
          justify-around sm:justify-start
          gap-2 sm:gap-4
          py-3 sm:pt-6
          px-3 sm:px-4
          text-sm
        "
      >
        {/* ADD ITEMS */}
        <NavLink
          to="/add"
          className="
            flex items-center gap-2 sm:gap-3
            px-3 py-2
            rounded-lg
            border border-gray-300
            hover:bg-gray-100
          "
        >
          <img src={assets.add_icon} alt="" className="h-5 w-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        {/* LIST ITEMS */}
        <NavLink
          to="/list"
          className="
            flex items-center gap-2 sm:gap-3
            px-3 py-2
            rounded-lg
            border border-gray-300
            hover:bg-gray-100
          "
        >
          <img src={assets.order_icon} alt="" className="h-5 w-5" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        {/* ORDERS */}
        <NavLink
          to="/orders"
          className="
            flex items-center gap-2 sm:gap-3
            px-3 py-2
            rounded-lg
            border border-gray-300
            hover:bg-gray-100
          "
        >
          <img src={assets.order_icon} alt="" className="h-5 w-5" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
