// Customer Frontend
// Author: Nishtha

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { CATEGORIES, CUSTOMER_PRODUCTS } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useWishlist from "../../hooks/useWishlist";
import ProductGrid from "../../components/customer/ProductGrid";

export default function CategoryProducts() {
    const { categoryId } = useParams();
    const { wishlistedIds, toggleWishlist } = useWishlist();

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useDocumentTitle(category?.name || "Category");

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            // Load category details and its products together.
            const [categoryRes, productsRes] = await Promise.all([
                axiosInstance.get(CATEGORIES.BY_ID(categoryId)),
                axiosInstance.get(CUSTOMER_PRODUCTS.BY_CATEGORY(categoryId)),
            ]);

            setCategory(categoryRes.data.data || null);
            setProducts(productsRes.data.products || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load this category.");

        } finally {
            setIsLoading(false);
        }
    }

    // Reload data whenever a different category is selected.
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    return (
        <div className="space-y-6">

            {/* Category information */}
            <div>
                <Link to="/categories" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
                    <ChevronLeft size={14} /> All categories
                </Link>

                <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
                    {category?.name || "Category"}
                </h1>

                {category?.description ? (
                    <p className="mt-1 text-sm text-ink-muted">{category.description}</p>
                ) : null}
            </div>

            {/* Products belonging to the selected category */}
            <ProductGrid
                products={products}
                isLoading={isLoading}
                error={error}
                onRetry={load}
                onToggleWishlist={toggleWishlist}
                wishlistedIds={wishlistedIds}
                emptyTitle="No products in this category yet"
            />
        </div>
    );
}