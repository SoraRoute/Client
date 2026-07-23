import { Link, NavLink } from "react-router-dom";
import { Heart, LogOut, Search, ShoppingCart } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER } from "../../api/endpoints";
import toast from "react-hot-toast";

const navLinkClass = ({ isActive }) =>
  [
    "text-sm font-medium transition-colors",
    isActive
      ? "text-ink"
      : "text-ink-muted hover:text-gold-600",
  ].join(" ");

export default function Navbar() {
  const { isAuthenticated, user, clear } = useCustomerAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

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
    <header className="sticky top-0 z-40 border-b border-paper-line bg-paper-raised/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32">
            <polygon
              points="16,2 29,9 29,23 16,30 3,23 3,9"
              fill="#15161B"
            />
            <polygon
              points="16,8 24,12.5 24,19.5 16,24 8,19.5 8,12.5"
              fill="#D89A1F"
            />
          </svg>

          <span className="font-display text-lg font-semibold tracking-tight">
            MarketHive
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-gold-100 hover:text-gold-700"
          >
            <Search size={18} />
          </Link>

          <Link
            to="/wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-gold-100 hover:text-gold-700"
          >
            <Heart size={18} />
          </Link>

          <Link
            to="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-gold-100 hover:text-gold-700"
          >
            <ShoppingCart size={18} />
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/account/profile"
                className="group flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-gold-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 text-sm font-bold text-white shadow-md transition group-hover:scale-105">
                  {initial}
                </div>

                <div className="hidden lg:block">
                  <p className="text-xs text-ink-muted">
                    
                  </p>

                  <p className="max-w-[120px] truncate text-sm font-semibold text-ink">
                    {user?.name}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-red-100 hover:text-red-600"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-2 rounded-xl bg-gold-500 px-5 py-2 text-sm font-semibold text-ink transition hover:bg-gold-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}