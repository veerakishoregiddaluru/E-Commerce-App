import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token || !orderId) return;

      const response = await axios.post(
        backendUrl + "/api/order/verify",
        { success, orderId },
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success("Payment Successful 🎉");
        setCartItems({});
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error in Stripe Verification", error);
      toast.error("Payment verification failed");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token, success, orderId]);

  return <div></div>;
};

export default Verify;
