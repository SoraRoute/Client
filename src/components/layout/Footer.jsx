import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800 bg-[#15161B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Logo & Description */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
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

              <span className="font-display text-xl font-bold text-white">
                MarketHive
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">
              A marketplace where independent sellers set up shop and shoppers
              discover quality products from trusted businesses.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-400">
                Shop
              </h4>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/products"
                    className="text-gray-300 transition-all duration-200 hover:pl-2 hover:text-gold-400"
                  >
                    All Products
                  </Link>
                </li>

                <li>
                  <Link
                    to="/categories"
                    className="text-gray-300 transition-all duration-200 hover:pl-2 hover:text-gold-400"
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-400">
                Sell
              </h4>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/seller/register"
                    className="text-gray-300 transition-all duration-200 hover:pl-2 hover:text-gold-400"
                  >
                    Become a Seller
                  </Link>
                </li>

                <li>
                  <Link
                    to="/seller/login"
                    className="text-gray-300 transition-all duration-200 hover:pl-2 hover:text-gold-400"
                  >
                    Seller Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-zinc-800 pt-6">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gold-400">MarketHive</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}