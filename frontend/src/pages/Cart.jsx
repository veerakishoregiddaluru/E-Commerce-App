import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    cartLoaded, // ✅ IMPORTANT
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  /* ================= BUILD CART DATA ================= */
  useEffect(() => {
    if (!cartLoaded) return; // ⛔ wait until cart is loaded

    if (products.length > 0) {
      const tempData = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const quantity = cartItems[productId][size];

          if (quantity > 0) {
            tempData.push({
              _id: productId,
              size,
              quantity,
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products, cartLoaded]);

  return (
    <div className="min-h-screen bg-[#f7f8fc] border-t pt-16 px-4 md:px-10">
      {/* TITLE */}
      <div className="text-2xl mb-8">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* ================= LOADING STATE ================= */}
      {!cartLoaded ? (
        <div className="flex items-center justify-center py-24 text-gray-500">
          Loading your cart...
        </div>
      ) : cartData.length === 0 ? (
        /* ================= EMPTY CART ================= */
        <div className="flex flex-col items-center justify-center text-center rounded-2xl shadow-sm">
          <img
            src={assets.empty_cart}
            alt="Empty Cart"
            className="w-40 sm:w-48 mb-6 opacity-90"
          />

          <h2 className="text-xl font-semibold text-gray-800">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-2 max-w-sm">
            Looks like you haven’t added anything yet. Start shopping to see
            products here.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-lg text-sm font-medium
              bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Shop Now
          </button>
        </div>
      ) : (
        /* ================= CART ITEMS ================= */
        <>
          <div className="space-y-4">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id,
              );

              if (!productData) return null;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border
                    hover:shadow-md transition p-4 sm:p-5
                    grid grid-cols-1 sm:grid-cols-[4fr_1fr_0.5fr]
                    gap-4 items-center"
                >
                  {/* PRODUCT INFO */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={productData.image[0]}
                      className="w-16 h-20 sm:w-20 sm:h-24
                        rounded-lg object-cover border"
                      alt={productData.name}
                    />

                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {productData.name}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="font-semibold text-indigo-600">
                          {currency}
                          {productData.price}.00
                        </span>

                        <span className="px-3 py-1 rounded-full bg-gray-100 text-black">
                          Size {item.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QUANTITY */}
                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value),
                          )
                    }
                    className="w-20 px-3 py-2 rounded-md border
                      focus:outline-none focus:ring-2
                      focus:ring-indigo-500"
                  />

                  {/* REMOVE */}
                  <img
                    src={assets.bin_icon}
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="w-5 cursor-pointer opacity-70
                      hover:opacity-100 transition"
                    alt="Remove"
                  />
                </div>
              );
            })}
          </div>

          {/* TOTAL & CHECKOUT */}
          <div className="flex justify-end my-16">
            <div
              className="w-full sm:w-[420px]
              bg-white rounded-2xl shadow-sm p-6"
            >
              <CartTotal />

              <div className="w-full text-end">
                <button
                  onClick={() => navigate("/place-order")}
                  className="mt-6 w-full px-6 py-3
                    rounded-lg text-sm font-semibold
                    bg-gray-900 text-white
                    hover:bg-indigo-600 transition"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
