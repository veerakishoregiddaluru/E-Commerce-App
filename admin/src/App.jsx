import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import { useEffect, useState } from "react";
import Login from "./components/Login";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

export default function App() {
  // ✅ USE adminToken (NOT user token)
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || "",
  );

  // Keep adminToken in sync
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* ✅ ADMIN AUTH CHECK */}
      {adminToken === "" ? (
        <Login setToken={setAdminToken} /> // Admin login
      ) : (
        <>
          <Navbar setToken={setAdminToken} />
          <div className="flex">
            <Sidebar />
            <div className="ml-6 mt-8 w-full">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
