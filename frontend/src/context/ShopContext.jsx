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
  const [cartLoaded, setCartLoaded] = useState(false);

  const navigate = useNavigate();

  /* ================= AUTH HEADER ================= */
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size!");
      return;
    }

    // optimistic UI update
    const cartData = structuredClone(cartItems);
    cartData[itemId] ??= {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    if (!token) return;

    try {
      await axios.post(
        backendUrl + "/api/cart/add",
        { itemId, size },
        { headers: getAuthHeader() },
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Cart update failed");
    }
  };

  /* ================= CART COUNT ================= */
  const getCartCount = () => {
    let total = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        total += cartItems[items][size];
      }
    }
    return total;
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (!token) return;

    try {
      await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity },
        { headers: getAuthHeader() },
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  /* ================= CART AMOUNT ================= */
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

  /* ================= PRODUCTS ================= */
  const getProductData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  /* ================= USER CART ================= */
  const getUserCart = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: getAuthHeader() },
      );

      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (error) {
      console.error("Cart fetch failed", error);
    } finally {
      setCartLoaded(true);
    }
  };

  /* ================= USER PROFILE ================= */
  const getUserProfile = async () => {
    try {
      if (!token) return null;

      const res = await axios.get(backendUrl + "/api/user/profile", {
        headers: getAuthHeader(),
      });

      return res.data.success ? res.data.user : null;
    } catch (error) {
      console.error("Profile fetch error", error);
      return null;
    }
  };

  /* ================= EFFECTS ================= */

  // 1️⃣ load public data
  useEffect(() => {
    getProductData();
  }, []);

  // 2️⃣ restore token on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 3️⃣ fetch cart AFTER token is set
  useEffect(() => {
    if (token) {
      getUserCart();
    } else {
      setCartItems({});
      setCartLoaded(true);
    }
  }, [token]);

  /* ================= CONTEXT ================= */
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
        getAuthHeader,
        cartLoaded,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
