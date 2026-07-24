import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, LayoutGrid, Package, PackageCheck, PackageX } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { SELLER_DASHBOARD } from "../../api/endpoints";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";

export default function Dashboard() {
    useDocumentTitle("Dashboard");

    const [summary, setSummary] = useState(null);
    const [productStats, setProductStats] = useState(null);
    const [recentProducts, setRecentProducts] = useState([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setIsLoading(true);
        setError("");
        try {
            const [summaryRes, statsRes, recentRes, categoryRes] = await Promise.all([
                axiosInstance.get(SELLER_DASHBOARD.SUMMARY),
                axiosInstance.get(SELLER_DASHBOARD.PRODUCT_STATISTICS),
                axiosInstance.get(SELLER_DASHBOARD.RECENT_PRODUCTS),
                axiosInstance.get(SELLER_DASHBOARD.CATEGORY_WISE_COUNT),
            ]);

            setSummary(summaryRes.data.data);
            setProductStats(statsRes.data.data);
            setRecentProducts(recentRes.data.data || []);
            setCategoryBreakdown(categoryRes.data.data || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load your dashboard.");

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (isLoading) return <Loader fullScreen label="Loading your dashboard…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    return (
        <div className="space-y-8">


            <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard icon={Package} label="Total products" value={summary?.totalProducts ?? 0} accent="teal" />
                <StatCard icon={PackageCheck} label="Active" value={summary?.activeProducts ?? 0} accent="teal" />
                <StatCard icon={PackageX} label="Inactive" value={summary?.inactiveProducts ?? 0} />
                <StatCard icon={LayoutGrid} label="Categories" value={summary?.totalCategories ?? 0} accent="teal" />
                <StatCard icon={Boxes} label="Total stock" value={summary?.totalStock ?? 0} />
            </div>

            {productStats ? (
                <section>
                    <h2 className="mb-3 font-display text-lg font-semibold text-ink">Pricing overview</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <StatCard label="Average price" value={formatPrice(productStats.averagePrice)} />
                        <StatCard label="Highest price" value={formatPrice(productStats.highestPrice)} />
                        <StatCard label="Lowest price" value={formatPrice(productStats.lowestPrice)} />
                    </div>
                </section>
            ) : null}

            <div className="space-y-8">
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold text-ink">
                            Recent products
                        </h2>

                        <Link
                            to="/seller/products"
                            className="text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                            View all
                        </Link>
                    </div>

                    {recentProducts.length === 0 ? (
                        <p className="text-sm text-ink-muted">No products yet.</p>
                    ) : (
                        <div className="divide-y divide-paper-line rounded-2xl border border-paper-line bg-paper-raised">
                            {recentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between gap-3 px-4 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="line-clamp-1 text-sm font-medium text-ink">
                                            {product.title}
                                        </p>

                                        <p className="text-xs text-ink-muted">
                                            {formatPrice(product.price)} · Stock: {product.stock} ·{" "}
                                            {formatDate(product.created_at)}
                                        </p>
                                    </div>

                                    <StatusBadge status={product.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>


                <section>
                    <h2 className="mb-3 font-display text-lg font-semibold text-ink">
                        Products by category
                    </h2>

                    {categoryBreakdown.length === 0 ? (
                        <p className="text-sm text-ink-muted">No products yet.</p>
                    ) : (
                        <div className="divide-y divide-paper-line rounded-2xl border border-paper-line bg-paper-raised">
                            {categoryBreakdown.map((row) => (
                                <div
                                    key={row.categoryName}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    <span className="text-sm text-ink-soft">
                                        {row.categoryName}
                                    </span>

                                    <span className="text-sm font-medium text-ink">
                                        {row.productCount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
