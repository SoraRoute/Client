// Customer Frontend
// Author: Nishtha

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_PRODUCTS } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useWishlist from "../../hooks/useWishlist";
import ProductGrid from "../../components/customer/ProductGrid";

export default function Shop() {
    useDocumentTitle("Shop");

    const navigate = useNavigate();
    const { wishlistedIds, toggleWishlist } = useWishlist();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [keyword, setKeyword] = useState("");

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            // Load all active products for the shop page.
            const res = await axiosInstance.get(CUSTOMER_PRODUCTS.BASE);
            setProducts(res.data.products || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load products.");

        } finally {
            setIsLoading(false);
        }
    }

    // Fetch products when the page loads.
    useEffect(() => {
        load();
    }, []);

    function handleSearchSubmit(e) {
        e.preventDefault();

        // Redirect to the dedicated search page.
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    }

    return (
        <div className="space-y-6">

            {/* Shop header and quick search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <h1 className="font-display text-2xl font-semibold text-ink">
                    All products
                </h1>

                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    />

                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search products…"
                        className="w-full rounded-xl border border-paper-line bg-paper-raised py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300"
                    />
                </form>

            </div>

            {/* Product listing */}
            <ProductGrid
                products={products}
                isLoading={isLoading}
                error={error}
                onRetry={load}
                onToggleWishlist={toggleWishlist}
                wishlistedIds={wishlistedIds}
                emptyTitle="No products yet"
                emptyDescription="Sellers haven't listed anything active right now — check back soon."
            />

        </div>
    );
}