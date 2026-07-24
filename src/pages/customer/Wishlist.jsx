// Customer Frontend
// Author: Nishtha

import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_WISHLIST } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import ProductCard from "../../components/customer/ProductCard";

export default function Wishlist() {
    useDocumentTitle("Wishlist");

    const { wishlistedIds, toggleWishlist, reloadWishlist } = useWishlist();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            // Fetch all products saved in the customer's wishlist.
            const res = await axiosInstance.get(CUSTOMER_WISHLIST.BASE);
            setProducts(res.data.wishlist || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load your wishlist.");

        } finally {
            setIsLoading(false);
        }
    }

    // Load wishlist items when the page opens.
    useEffect(() => {
        load();
    }, []);

    async function handleToggle(product) {
        // Keep both the shared wishlist state and page data in sync.
        await toggleWishlist(product);
        reloadWishlist();
        load();
    }

    if (isLoading) return <Loader fullScreen label="Loading your wishlist…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    // Show an empty state when no products are wishlisted.
    if (products.length === 0) {
        return (
            <EmptyState
                icon={Heart}
                title="Your wishlist is empty"
                description="Save products you like so you can find them again easily."
                action={
                    <Link to="/products">
                        <Button>Browse products</Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div className="space-y-6">

            <h1 className="font-display text-2xl font-semibold text-ink">
                Your wishlist
            </h1>

            {/* Saved products */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onToggleWishlist={handleToggle}
                        isWishlisted={wishlistedIds.has(product.id)}
                    />
                ))}
            </div>

        </div>
    );
}