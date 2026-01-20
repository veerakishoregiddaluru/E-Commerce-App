import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        <div className="">
          <NavLink to="/">
            <img src={assets.e_logo2} alt="" className="w-20 mb-5 " />
          </NavLink>
          <p className="w-full md:h-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Perspiciatis sunt debitis mollitia, numquam voluptatibus voluptate
            adipisci! Vitae autem sint facilis omnis, culpa magni eveniet error
            tenetur odit libero soluta perferendis.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium md-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium md-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-234-567-893</li>

            <li>contact@forever.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2026@ forever.com All Rights Reverved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
