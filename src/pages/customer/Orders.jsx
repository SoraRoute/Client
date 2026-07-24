import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_ORDERS } from "../../api/endpoints";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

export default function Orders() {
    useDocumentTitle("Your orders");

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setIsLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(CUSTOMER_ORDERS.BASE);
            setOrders(res.data.orders || []);
        } catch (err) {
            setError(err.friendlyMessage || "Failed to load your orders.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (isLoading) return <Loader fullScreen label="Loading your orders…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    if (orders.length === 0) {
        return (
            <EmptyState
                icon={PackageSearch}
                title="No orders yet"
                description="Once you place an order, it'll show up here."
                action={
                    <Link to="/products">
                        <Button>Start shopping</Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-semibold text-ink">Your orders</h1>

            <div className="space-y-3">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        to={`/orders/${order.id}`}
                        className="block rounded-2xl border border-paper-line bg-paper-raised p-5 transition-shadow hover:shadow-card"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-ink-muted">Order #{order.id}</p>
                                <p className="mt-0.5 text-sm text-ink-muted">{formatDate(order.created_at)}</p>
                            </div>
                            <StatusBadge status={order.order_status} />
                        </div>
                        <div className="mt-3 flex items-center justify-end">
                            <p className="font-semibold text-ink">{formatPrice(order.total_amount)}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
