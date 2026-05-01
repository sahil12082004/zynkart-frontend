import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative bg-white/[0.02] border border-white/10 hover:border-[#c8ff00]/50 transition-all duration-300 cursor-pointer animate-fadeInUp overflow-hidden"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-white/5 aspect-square">
        <img
          src={product.imageUrl || `https://placehold.co/400x400/111/c8ff00?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
            <Eye size={14} />
            View
          </button>
        </div>

        {/* Stock badge */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-1 tracking-widest">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-white/10 text-white/60 text-[10px] font-bold uppercase px-2 py-1 tracking-widest">
            Out of Stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-[#c8ff00] text-[10px] uppercase tracking-[0.25em] font-medium">
          {product.category?.name || 'Uncategorized'}
        </p>

        {/* Name */}
        <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-tight group-hover:text-[#c8ff00] transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Price + Cart */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-white font-black text-lg">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="w-9 h-9 bg-[#c8ff00]/10 border border-[#c8ff00]/30 flex items-center justify-center hover:bg-[#c8ff00] hover:border-[#c8ff00] group/btn transition-all duration-200"
          >
            <ShoppingCart
              size={15}
              className="text-[#c8ff00] group-hover/btn:text-black transition-colors"
            />
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c8ff00] group-hover:w-full transition-all duration-500" />
    </div>
  );
};

export default ProductCard;