import { Link, NavLink } from "react-router-dom";
import { Heart, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER } from "../../api/endpoints";
import toast from "react-hot-toast";

const navLinkClass = ({ isActive }) =>
  [
    "text-sm font-medium transition-colors",
    isActive ? "text-ink" : "text-ink-muted hover:text-ink",
  ].join(" ");

export default function Navbar() {
  const { isAuthenticated, clear } = useCustomerAuth();

  async function handleLogout() {
    try {
      await axiosInstance.post(CUSTOMER.LOGOUT);
    } catch (error) {
      // Logging out should feel instant even if the network call fails —
      // the cookie will simply expire in the worst case.
    } finally {
      clear();
      toast.success("Logged out successfully.");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-paper-raised/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="22" height="22" viewBox="0 0 32 32">
            <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" fill="#15161B" />
            <polygon points="16,8 24,12.5 24,19.5 16,24 8,19.5 8,12.5" fill="#D89A1F" />
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight">
            MarketHive
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
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

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
            aria-label="Search products"
          >
            <Search size={18} />
          </Link>
          <Link
            to="/wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>
          <Link
            to="/cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/account/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
                aria-label="Account"
              >
                <User size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-ink hover:bg-gold-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
