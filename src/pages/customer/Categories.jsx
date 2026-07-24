// Customer Frontend
// Author: Nishtha

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { CATEGORIES } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

export default function Categories() {
    useDocumentTitle("Categories");

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            // Fetch all categories available to customers.
            const res = await axiosInstance.get(CATEGORIES.CUSTOMER_LIST);
            setCategories(res.data.data || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load categories.");

        } finally {
            setIsLoading(false);
        }
    }

    // Load categories when the page opens.
    useEffect(() => {
        load();
    }, []);

    if (isLoading) return <Loader fullScreen label="Loading categories…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    return (
        <div className="space-y-6">

            <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>

            {categories.length === 0 ? (
                <EmptyState icon={LayoutGrid} title="No categories yet" />
            ) : (
                // Display all available product categories.
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/categories/${category.id}`}
                            className="rounded-2xl border border-paper-line bg-paper-raised p-5 shadow-card transition-shadow hover:shadow-pop"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                                <LayoutGrid size={18} />
                            </span>

                            <h3 className="mt-3 font-display text-base font-medium text-ink">{category.name}</h3>

                            {category.description ? (
                                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{category.description}</p>
                            ) : null}
                        </Link>
                    ))}

                </div>
            )}
        </div>
    );
}