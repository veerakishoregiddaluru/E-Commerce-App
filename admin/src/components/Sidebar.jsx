import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="min-h-screen w-[18%] border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-6 text-[15px]">
        <NavLink
          to="/add"
          className="flex items-center gap-3 rounded-l border border-gray-300 border-r-0 px-3 py-2"
        >
          <img src={assets.add_icon} alt="" className="h-5 w-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className="flex items-center gap-3 rounded-l border border-gray-300 border-r-0 px-3 py-2"
        >
          <img src={assets.order_icon} alt="" className="h-5 w-5" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className="flex items-center gap-3 rounded-l border border-gray-300 border-r-0 px-3 py-2"
        >
          <img src={assets.order_icon} alt="" className="h-5 w-5" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
