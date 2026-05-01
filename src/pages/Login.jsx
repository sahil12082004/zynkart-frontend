import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const token =
          typeof res.data === "string"
            ? res.data
            : res.data.token || res.data.accessToken || res.data.jwt;

        const userName =
          res.data.name || res.data.user?.name || formData.email;

        if (!token) {
          toast.error("Login failed — no token received");
          return;
        }

        login(token, { email: formData.email, name: userName });
        toast.success("Welcome back!");
        navigate("/");
      } else {
        await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Registered! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl p-8">

        {/* Toggle Login / Register */}
        <div className="flex mb-8 bg-[#0a0a0a] rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all ${
              isLogin ? "bg-[#c8ff00] text-black" : "text-gray-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all ${
              !isLogin ? "bg-[#c8ff00] text-black" : "text-gray-400"
            }`}
          >
            Register
          </button>
        </div>

        <h2 className="text-white text-2xl font-bold uppercase tracking-widest mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#c8ff00] transition-all placeholder-gray-600"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#c8ff00] transition-all placeholder-gray-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#c8ff00] transition-all placeholder-gray-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#c8ff00] text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:opacity-90 transition-all mt-2 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#c8ff00] cursor-pointer hover:underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;