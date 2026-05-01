import { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/cart");

      let items = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (res.data?.cartItems) {
        items = res.data.cartItems;
      } else if (res.data?.items) {
        items = res.data.items;
      } else if (res.data?.content) {
        items = res.data.content;
      }

      setCart(items);
      setCartCount(items.length);
    } catch (err) {
      setCart([]);
      setCartCount(0);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}