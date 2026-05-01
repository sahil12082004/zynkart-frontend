import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get("http://13.233.146.236:8080/products"),
          axios.get("http://13.233.146.236:8080/categories"),
        ]);
        setProducts(pRes.data);
        setCategories(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = selected === "All"
    ? products
    : products.filter(p => p.category?.name === selected);

  return (
    <div className="animate-fadeIn min-h-screen bg-[#0a0a0a] pt-24 px-6 pb-12">
      <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-2">Products</h1>
      <p className="text-zinc-400 mb-8">Shop Smarter. Live Better.</p>

      {/* Category Filter */}
      <div className="flex gap-3 flex-wrap mb-10">
        {["All", ...categories.map(c => c.name)].map(cat => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              selected === cat
                ? "bg-[#c8ff00] text-black"
                : "border border-zinc-700 text-zinc-400 hover:border-[#c8ff00] hover:text-[#c8ff00]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-[#c8ff00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-zinc-500 mt-20 text-xl">No products found.</div>
      )}
    </div>
  );
}