import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCartItems } = useContext(ShopContext);
  const session_id = searchParams.get("session_id");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!session_id) {
          toast.error("Invalid Stripe session");
          return navigate("/cart");
        }

        const { data } = await axios.post(
          backendUrl + "/api/order/verifyStripe",
          { session_id }, // ✅ MUST be body, not query
        );

        if (data.success) {
          toast.success("Payment Successfull🎉");
          setCartItems({});
          localStorage.removeItem("cartItems");
          navigate("/orders");
        } else {
          toast.error("Stripe verification failed");
          navigate("/cart");
        }
      } catch (error) {
        console.error("VERIFY ERROR:", error);
        toast.error("Stripe verification error");
        navigate("/cart");
      }
    };

    verifyPayment();
  }, []);

  return (
    <h2 className="text-center mt-20 text-lg">
      Verifying payment, please wait...
    </h2>
  );
};

export default Verify;
