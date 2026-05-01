import { Trash2 } from "lucide-react";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center gap-4 bg-[#111] border border-white/10 rounded-xl p-4 hover:border-[#c8ff00]/30 transition">
      <div className="w-20 h-20 bg-[#1a1a1a] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
        {item.product?.imageUrl ? (
          <img src={item.product.imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">🛍️</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold">{item.product?.name || "Product"}</h3>
        <p className="text-gray-400 text-sm mt-1">Qty: {item.quantity}</p>
        <p className="text-[#c8ff00] font-bold mt-1">₹{(item.product?.price * item.quantity)?.toLocaleString()}</p>
      </div>
      <button onClick={() => onRemove(item.id)} className="text-gray-500 hover:text-red-400 transition p-2 rounded-lg hover:bg-red-400/10">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;