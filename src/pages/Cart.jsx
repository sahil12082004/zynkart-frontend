import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { token } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };
    load();
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      toast.success("Item removed");
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      await api.post("/orders/place", {});
      toast.success("Order placed successfully! 🎉");
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c8ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn min-h-screen bg-[#0a0a0a] text-white pb-10 pt-20 px-4">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
        <p className="text-gray-400 mb-8">{cart.length} item(s)</p>

        {cart.length === 0 ? (

          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ShoppingBag size={64} className="text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-400">Your cart is empty</h2>
            <p className="text-gray-600 text-sm">Add some products to get started!</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-[#c8ff00] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#aadd00] transition text-sm uppercase tracking-widest"
            >
              Shop Now
            </button>
          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold mb-6 uppercase tracking-widest">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-[#c8ff00]">FREE</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#c8ff00]">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full bg-[#c8ff00] text-black font-bold py-4 rounded-xl hover:bg-[#aadd00] transition text-sm uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;