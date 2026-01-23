import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) return toast.error("Select Product Size!");

    const cartData = structuredClone(cartItems);

    cartData[itemId] ??= {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    setCartItems(cartData);
    console.log("its a Token", token);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          {
            headers: { token },
          },
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "Internal Server Error");
        // console.error("Error Occured", error);
      }
    }
  };

  const getCartCount = () => {
    let total = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        total += cartItems[items][item];
      }
    }
    console.log("total cart items", total);

    return total;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "Internal Server Error");
      }
    }
  };

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (!product) continue;

      for (const size in cartItems[id]) {
        total += product.price * cartItems[id][size];
      }
    }
    return total;
  };

  const getProductData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/profile", {
        headers: { token },
      });

      if (res.data.success) {
        return res.data.user;
      } else {
        toast.error(res.data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
      return null;
    }
  };

  useEffect(() => {
    getProductData();
  }, [products]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, []);

  return (
    <ShopContext.Provider
      value={{
        products,
        currency,
        delivery_fee,
        search,
        showSearch,
        setSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        setCartItems,
        getProductData,
        getUserProfile,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
