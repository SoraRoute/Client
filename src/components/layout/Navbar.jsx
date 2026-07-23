import { Link, NavLink } from "react-router-dom";
import { Heart, LogOut, Search, ShoppingCart } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER } from "../../api/endpoints";
import toast from "react-hot-toast";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-white/10 text-gold-400 hover:bg-white/15 hover:text-gold-300"
      : "text-gray-300 hover:bg-white/10 hover:text-gold-400",
  ].join(" ");

export default function Navbar() {
  const { isAuthenticated, user, clear } = useCustomerAuth();

  const initial =
    user?.customer?.first_name?.charAt(0)?.toUpperCase() || "U";

  async function handleLogout() {
    try {
      await axiosInstance.post(CUSTOMER.LOGOUT);
    } catch (error) {
      // Ignore network errors so logout always feels instant.
    } finally {
      clear();
      toast.success("Logged out successfully.");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#15161B] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <svg width="24" height="24" viewBox="0 0 32 32">
            <polygon
              points="16,2 29,9 29,23 16,30 3,23 3,9"
              fill="#15161B"
              stroke="#D89A1F"
              strokeWidth="2"
            />
            <polygon
              points="16,8 24,12.5 24,19.5 16,24 8,19.5 8,12.5"
              fill="#D89A1F"
            />
          </svg>

          <span className="font-display text-2xl font-bold text-white">
            MarketHive
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>

          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-gold-400"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          <Link
            to="/wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-gold-400"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>

          <Link
            to="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-gold-400"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/account/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-sm font-bold text-white shadow-lg ring-2 ring-yellow-500/30 transition-all duration-200 hover:scale-105 hover:ring-yellow-400"
                aria-label="Account"
                title={`${user?.customer?.first_name ?? ""} ${
                  user?.customer?.last_name ?? ""
                }`.trim()}
              >
                {initial}
              </Link>

              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:scale-105 hover:from-yellow-500 hover:to-amber-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}