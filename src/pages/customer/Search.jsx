import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_PRODUCTS } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useWishlist from "../../hooks/useWishlist";
import ProductGrid from "../../components/customer/ProductGrid";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [inputValue, setInputValue] = useState(keyword);
    const { wishlistedIds, toggleWishlist } = useWishlist();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useDocumentTitle(keyword ? `Search · ${keyword}` : "Search");

    async function load(term) {
        if (!term.trim()) {
            setProducts([]);
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(CUSTOMER_PRODUCTS.SEARCH, {
                params: { keyword: term },
            });
            setProducts(res.data.products || []);
        } catch (err) {
            setError(err.friendlyMessage || "Search failed.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setInputValue(keyword);
        load(keyword);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    function handleSubmit(e) {
        e.preventDefault();
        setSearchParams(inputValue.trim() ? { keyword: inputValue.trim() } : {});
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="relative mx-auto max-w-xl">
                <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search for products…"
                    autoFocus
                    className="w-full rounded-2xl border border-paper-line bg-paper-raised py-3.5 pl-11 pr-4 text-sm text-ink shadow-card placeholder:text-ink-muted/70 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300"
                />
            </form>

            {keyword ? (
                <>
                    <p className="text-sm text-ink-muted">
                        Results for <span className="font-medium text-ink">&ldquo;{keyword}&rdquo;</span>
                    </p>
                    <ProductGrid
                        products={products}
                        isLoading={isLoading}
                        error={error}
                        onRetry={() => load(keyword)}
                        onToggleWishlist={toggleWishlist}
                        wishlistedIds={wishlistedIds}
                        emptyTitle="No matches"
                        emptyDescription="Try a different keyword or browse categories instead."
                    />
                </>
            ) : null}
        </div>
    );
}
