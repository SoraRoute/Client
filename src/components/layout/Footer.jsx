import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-paper-line bg-paper-raised">

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">

                            <svg width="18" height="18" viewBox="0 0 32 32">
                                <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" fill="#15161B" />
                                <polygon
                                    points="16,8 24,12.5 24,19.5 16,24 8,19.5 8,12.5"
                                    fill="#D89A1F"
                                />
                            </svg>

                            <span className="font-display text-base font-semibold">MarketHive</span>
                        </div>

                        <p className="mt-2 max-w-xs text-sm text-ink-muted">
                            A marketplace where independent sellers set up shop and shoppers find
                            them.
                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-16">
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                Shop
                            </h4>

                            <ul className="mt-3 space-y-2 text-sm">
                                <li>
                                    <Link to="/products" className="text-ink-soft hover:text-ink">
                                        All products
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/categories" className="text-ink-soft hover:text-ink">
                                        Categories
                                    </Link>
                                </li>
                            </ul>

                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                Sell
                            </h4>
                            <ul className="mt-3 space-y-2 text-sm">
                                <li>
                                    <Link to="/seller/register" className="text-ink-soft hover:text-ink">
                                        Become a seller
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/seller/login" className="text-ink-soft hover:text-ink">
                                        Seller login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                    
                </div>

                <p className="mt-10 text-xs text-ink-muted">
                    © {new Date().getFullYear()} MarketHive. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
