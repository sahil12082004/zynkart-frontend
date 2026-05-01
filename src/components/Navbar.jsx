import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-200 ${
        isActive(to)
          ? 'text-[#c8ff00]'
          : 'text-white/60 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-white font-black text-xl tracking-[0.15em] uppercase hover:text-[#c8ff00] transition-colors">
          ZYNKART
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLink('/', 'Home')}
          {navLink('/products', 'Products')}
          {token && navLink('/orders', 'Orders')}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-5">
          {/* User name */}
          {token && user && (
            <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
              <User size={13} />
              <span>{user.name || user.email}</span>
            </div>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative group">
            <ShoppingCart
              size={20}
              className="text-white/70 group-hover:text-[#c8ff00] transition-colors"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c8ff00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login / Logout */}
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-[#c8ff00] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/70 hover:text-[#c8ff00] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-white/5 px-6 py-6 flex flex-col gap-6">
          {navLink('/', 'Home')}
          {navLink('/products', 'Products')}
          {token && navLink('/orders', 'Orders')}
          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white flex items-center gap-2"
          >
            <ShoppingCart size={14} />
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="text-left text-xs uppercase tracking-[0.2em] text-red-400 flex items-center gap-2"
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-[#c8ff00]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;