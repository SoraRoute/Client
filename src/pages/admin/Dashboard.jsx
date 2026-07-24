
// Authors: Nishtha & Pinki

import { useEffect, useState } from "react";
import { AlertTriangle, LayoutGrid, Package, PackageX, Store, UserCheck } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN_DASHBOARD } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatCard from "../../components/common/StatCard";

export default function Dashboard() {
    useDocumentTitle("Admin dashboard");

    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {

        setIsLoading(true);
        setError("");

        try {
            // Fetch the latest dashboard statistics.
            const res = await axiosInstance.get(ADMIN_DASHBOARD);
            setStats(res.data.data);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load the dashboard.");

        } finally {
            setIsLoading(false);
        }
    }

    // Load dashboard data when the page opens.
    useEffect(() => {
        load();
    }, []);

    if (isLoading) return <Loader fullScreen label="Loading dashboard…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    return (

        <div className="space-y-8">

            <h1 className="font-display text-2xl font-semibold text-ink">Platform overview</h1>

            {/* Seller statistics */}
            <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Sellers</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <StatCard icon={Store} label="Total sellers" value={stats?.totalSellers ?? 0} accent="teal" />
                    <StatCard icon={UserCheck} label="Active" value={stats?.activeSellers ?? 0} accent="teal" />
                    <StatCard icon={Store} label="Inactive" value={stats?.inactiveSellers ?? 0} />
                </div>
            </div>

            {/* Product statistics */}
            <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Products</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard icon={Package} label="Total products" value={stats?.totalProducts ?? 0} accent="teal" />
                    <StatCard icon={Package} label="Active" value={stats?.activeProducts ?? 0} accent="teal" />
                    <StatCard icon={PackageX} label="Inactive" value={stats?.inactiveProducts ?? 0} />
                    <StatCard icon={AlertTriangle} label="Low stock (< 10)" value={stats?.lowStockProducts ?? 0} />
                </div>
            </div>

            {/* Category summary */}
            <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Catalog</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <StatCard icon={LayoutGrid} label="Categories" value={stats?.totalCategories ?? 0} accent="teal" />
                </div>
            </div>
        </div>
    );
}