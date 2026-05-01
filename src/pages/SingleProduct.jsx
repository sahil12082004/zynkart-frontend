import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await api.post("/cart/add", { productId: product.id, quantity });
      await fetchCart();
      toast.success("Added to cart! 🛒");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c8ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Product not found.
      </div>
    );
  }

  return (
    <div className="animate-fadeIn min-h-screen bg-[#0a0a0a] text-white pb-10 pt-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-[#c8ff00] transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Product Image */}
          <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[350px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl">🛍️</div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center gap-6">
            <div>
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest font-semibold">
                {product.category?.name || product.category || "Product"}
              </span>
              <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < 4 ? "text-[#c8ff00] fill-[#c8ff00]" : "text-gray-600"}
                />
              ))}
              <span className="text-gray-400 text-sm ml-2">(4.0)</span>
            </div>

            <p className="text-gray-400 leading-relaxed">
              {product.description || "No description available for this product."}
            </p>

            <div className="text-4xl font-bold text-[#c8ff00]">
              ₹{product.price?.toLocaleString()}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Quantity:</span>
              <div className="flex items-center gap-3 border border-white/20 rounded-lg px-4 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-white hover:text-[#c8ff00] text-lg font-bold transition"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-white hover:text-[#c8ff00] text-lg font-bold transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex items-center justify-center gap-3 bg-[#c8ff00] text-black font-bold py-4 rounded-xl hover:bg-[#aadd00] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
            >
              <ShoppingCart size={18} />
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;