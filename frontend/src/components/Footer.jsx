import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-slate-50 mt-40">
      <div className="px-6 sm:px-10 lg:px-20">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-16 text-sm">
          {/* BRAND */}
          <div className="flex flex-col gap-4">
            <NavLink to="/">
              {/* LOGO CONTAINER (IMPORTANT) */}
              <div
                className="
              w-fit
              bg-white
              overflow-hidden
              rounded-xl
              footer-logo-animate
            "
              >
                <img
                  src={assets.kishore_trends1}
                  alt="Kishore Trends Logo"
                  className="
                w-20 h-20
                sm:w-[88px] sm:h-[88px]
                md:w-[96px] md:h-[96px]
                lg:w-[120px] lg:h-[120px]
                object-contain
                bg-transparent
              "
                />
              </div>
            </NavLink>

            <p className="max-w-md text-gray-600 leading-relaxed">
              Kishore Trends brings together modern fashion for men, women, and
              kids — blending comfort, quality, and everyday style. From
              timeless essentials to trending designs, we help every generation
              dress with confidence.
            </p>
          </div>

          {/* COMPANY */}
          <div>
            <p className="text-lg font-semibold mb-4 text-gray-800">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li className="hover:text-indigo-600 cursor-pointer">Home</li>
              <li className="hover:text-indigo-600 cursor-pointer">About Us</li>
              <li className="hover:text-indigo-600 cursor-pointer">Delivery</li>
              <li className="hover:text-indigo-600 cursor-pointer">
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <p className="text-lg font-semibold mb-4 text-gray-800">
              GET IN TOUCH
            </p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>📞 +91 98765 43210</li>
              <li>✉️ support@kishoretrends.com</li>
            </ul>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-gray-200">
          <p className="py-6 text-xs sm:text-sm text-center text-gray-500">
            © 2026 Kishore Trends. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
