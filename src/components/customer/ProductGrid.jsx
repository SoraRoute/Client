// Customer Frontend
// Author: Nishtha

import { PackageSearch } from "lucide-react";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";
import ProductCard from "./ProductCard";

export default function ProductGrid({
        products,
        isLoading,
        error,
        onRetry,
        emptyTitle = "No products found",
        emptyDescription = "Try adjusting your search or check back later.",
        onToggleWishlist,
        wishlistedIds,

    }){

        // Handle loading, error, and empty states before rendering the grid.
        if (isLoading) return <Loader fullScreen label="Loading products…" />;

        if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

        if (!products || products.length === 0) {
            return (
                <EmptyState icon={PackageSearch} title={emptyTitle} description={emptyDescription} />
            );
        }

        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                {/* Render each product as a reusable card */}
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={wishlistedIds ? wishlistedIds.has(product.id) : false}
                    />
                ))}

            </div>
        );
}