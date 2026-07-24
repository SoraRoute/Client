import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_HOME } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ProductCard from "../../components/customer/ProductCard";
import Button from "../../components/common/Button";

export default function Home() {
    useDocumentTitle("Home");

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setIsLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(CUSTOMER_HOME);
            setData(res.data);
        } catch (err) {
            setError(err.friendlyMessage || "Failed to load the home page.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (isLoading) return <Loader fullScreen label="Loading MarketHive…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    const { categories = [], featureProducts = [], newArrivals = [] } = data || {};

    return (
        <div className="space-y-14">
            {/* Hero */}
            <section className="overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
                    Independent sellers, one hive
                </p>
                <h1 className="mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-paper sm:text-4xl">
                    Find something worth buying today
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm text-paper/70">
                    Browse curated categories and fresh arrivals from sellers across MarketHive.
                </p>
                <Link to="/products" className="mt-6 inline-block">
                    <Button variant="gold" size="lg">
                        Shop all products
                    </Button>
                </Link>
            </section>

            {/* Categories */}
            {categories.length > 0 ? (
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-xl font-semibold text-ink">Shop by category</h2>
                        <Link to="/categories" className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/categories/${category.id}`}
                                className="shrink-0 rounded-full border border-paper-line bg-paper-raised px-5 py-2.5 text-sm font-medium text-ink-soft hover:border-gold-500 hover:text-ink"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}

            {/* Featured products */}
            {featureProducts.length > 0 ? (
                <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-ink">Featured products</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {featureProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            ) : null}

            {/* New arrivals */}
            {newArrivals.length > 0 ? (
                <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-ink">New arrivals</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {newArrivals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
