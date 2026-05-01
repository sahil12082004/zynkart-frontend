import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageSearch, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered": return "text-green-400 bg-green-400/10";
    case "cancelled": return "text-red-400 bg-red-400/10";
    case "processing": return "text-yellow-400 bg-yellow-400/10";
    default: return "text-[#c8ff00] bg-[#c8ff00]/10";
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");

        let orderList = [];
        if (Array.isArray(res.data)) {
          orderList = res.data;
        } else if (res.data?.orders) {
          orderList = res.data.orders;
        } else if (res.data?.content) {
          orderList = res.data.content;
        } else if (res.data?.data) {
          orderList = res.data.data;
        }

        setOrders(orderList);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-gray-400 mb-8">{orders.length} order(s) placed</p>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <PackageSearch size={64} className="text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-400">No orders yet</h2>
            <p className="text-gray-600 text-sm">Place your first order to see it here!</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-[#c8ff00] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#aadd00] transition text-sm uppercase tracking-widest"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">
                      Order <span className="text-white font-semibold">#{order.id}</span>
                    </span>
                    <span className="text-xs text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })
                        : "Date not available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${statusColor(order.status)}`}>
                      {order.status || "Placed"}
                    </span>
                    <span className="text-[#c8ff00] font-bold">
                      ₹{order.totalAmount?.toLocaleString() || "—"}
                    </span>
                    {expanded === order.id
                      ? <ChevronUp size={18} className="text-gray-400" />
                      : <ChevronDown size={18} className="text-gray-400" />
                    }
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="border-t border-white/10 px-5 py-4 flex flex-col gap-3">
                    {order.items?.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {item.product?.name || item.productName || "Product"}
                            </span>
                            <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                          </div>
                          <span className="text-gray-300">
                            ₹{((item.product?.price || item.price || 0) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm">No item details available</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;