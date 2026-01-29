import { useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const MyOrders = ({ orders }) => {
  const { backendUrl } = useContext(ShopContext);

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const res = await axios.get(
        `${backendUrl}/api/order/invoice/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      // create file download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Invoice error:", error);
      alert("Invoice download failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders?.map((order) => (
        <div key={order._id} className="border rounded-xl p-4 mb-4">
          <p>
            <b>Order ID:</b> {order._id}
          </p>
          <p>
            <b>Total:</b> ₹{order.amount}
          </p>

          <button
            onClick={() => downloadInvoice(order._id)}
            className="mt-3 px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
