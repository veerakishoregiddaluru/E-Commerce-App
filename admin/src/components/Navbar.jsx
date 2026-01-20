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
    <div className="flex items-center justify-between px-[4%] py-2">
      <img
        src={assets.kishore_logo}
        alt="Logo"
        className="w-19 h-20 object-contain rounded-xl  "
      />

      <button
        onClick={handleLogout}
        className="rounded-full bg-gray-600 px-5 py-2 text-xs text-white sm:px-7 sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
