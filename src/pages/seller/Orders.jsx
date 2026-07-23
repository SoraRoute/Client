import { useEffect, useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

const STATUS_OPTIONS = ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

// The endpoint returns one row per order item (joined with order + product),
// so multiple rows can share the same order_id when an order includes more
// than one of this seller's products. Group them for display.
function groupByOrder(rows) {
    const map = new Map();
    for (const row of rows) {
        if (!map.has(row.order_id)) {
            map.set(row.order_id, {
                orderId: row.order_id,
                orderStatus: row.order_status,
                createdAt: row.created_at,
                items: [],
            });
        }
        map.get(row.order_id).items.push(row);
    }
    return Array.from(map.values()).sort((a, b) => b.orderId - a.orderId);
}

export default function Orders() {
    useDocumentTitle("Orders");

    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingOrderId, setPendingOrderId] = useState(null);

    async function load() {
        setIsLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(SELLER.ORDERS);
            setRows(res.data.data || []);
        } catch (err) {
            setError(err.friendlyMessage || "Failed to load your orders.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const orders = useMemo(() => groupByOrder(rows), [rows]);

    async function handleStatusChange(orderId, nextStatus) {
        setPendingOrderId(orderId);
        try {
            await axiosInstance.patch(SELLER.ORDER_STATUS(orderId), { order_status: nextStatus });
            setRows((prev) =>
                prev.map((row) => (row.order_id === orderId ? { ...row, order_status: nextStatus } : row)),
            );
            toast.success("Order status updated");
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update order status.");
        } finally {
            setPendingOrderId(null);
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading orders…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    if (orders.length === 0) {
        return (
            <EmptyState
                icon={Receipt}
                title="No orders yet"
                description="Orders containing your products will show up here."
            />
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => {
                    const orderTotal = order.items.reduce((sum, item) => sum + Number(item.total_price), 0);
                    return (
                        <div key={order.orderId} className="rounded-2xl border border-paper-line bg-paper-raised p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-ink-muted">Order #{order.orderId}</p>
                                    <p className="mt-0.5 text-sm text-ink-muted">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={order.orderStatus} />
                                    <select
                                        value=""
                                        onChange={(e) => e.target.value && handleStatusChange(order.orderId, e.target.value)}
                                        disabled={pendingOrderId === order.orderId}
                                        className="rounded-lg border border-paper-line bg-paper px-2.5 py-1.5 text-xs text-ink-soft focus:border-teal-500 focus:outline-none disabled:opacity-50"
                                    >
                                        <option value="">Update status…</option>
                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 divide-y divide-paper-line border-t border-paper-line">
                                {order.items.map((item) => (
                                    <div key={item.order_item_id} className="flex items-center justify-between py-2 text-sm">
                                        <span className="text-ink-soft">
                                            {item.title} <span className="text-ink-muted">× {item.quantity}</span>
                                        </span>
                                        <span className="font-medium text-ink">{formatPrice(item.total_price)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-paper-line pt-3 text-sm font-semibold">
                                <span>Total (your items)</span>
                                <span>{formatPrice(orderTotal)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
