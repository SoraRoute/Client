
// Authors: Nishtha & Pinki

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN_ORDERS } from "../../api/endpoints";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";

// Available order status values for admin updates.
const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderDetail() {

    const { orderId } = useParams();
    useDocumentTitle(`Order #${orderId}`);

    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    async function load() {

        setIsLoading(true);
        setError("");

        try {
            // Fetch complete order details, including all ordered items.
            const res = await axiosInstance.get(ADMIN_ORDERS.BY_ID(orderId));
            setRows(res.data.data || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load this order.");

        } finally {
            setIsLoading(false);
        }
    }

    // Reload order details whenever the route changes.
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    async function handleStatusChange(nextStatus) {

        if (!nextStatus) return;
        setIsUpdating(true);

        try {
            await axiosInstance.patch(ADMIN_ORDERS.STATUS(orderId), { order_status: nextStatus });

            // Reflect the updated status without fetching the order again.
            setRows((prev) => prev.map((row) => ({ ...row, order_status: nextStatus })));

            toast.success("Order status updated");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update status.");

        } finally {
            setIsUpdating(false);
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading order…" />;

    if (error || rows.length === 0) {
        return <ErrorMessage message={error || "Order not found."} onRetry={load} />;
    }

    // Shared order details are repeated for every item, so use the first row as the header.
    const header = rows[0];

    return (
        <div className="mx-auto max-w-lg space-y-6">

            <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
                <ChevronLeft size={14} /> All orders
            </Link>

            <div className="rounded-2xl border border-paper-line bg-paper-raised p-6">

                <div className="flex items-center justify-between">
                    <h1 className="font-display text-xl font-semibold text-ink">Order #{header.order_id}</h1>
                    <StatusBadge status={header.order_status} />
                </div>

                <p className="mt-1 text-sm text-ink-muted">{formatDate(header.created_at)}</p>

                {/* Customer information */}
                <div className="mt-4 border-t border-paper-line pt-4">
                    <p className="text-xs uppercase tracking-wide text-ink-muted">Customer</p>
                    <p className="mt-0.5 text-sm text-ink">
                        {header.first_name} {header.last_name}
                    </p>
                    <p className="text-sm text-ink-muted">{header.email}</p>
                </div>

                {/* Ordered products */}
                <div className="mt-4 divide-y divide-paper-line border-t border-paper-line">
                    {rows.map((row, index) => (
                        <div key={`${row.title}-${index}`} className="flex items-center justify-between py-2 text-sm">
                            <span className="text-ink-soft">
                                {row.title} <span className="text-ink-muted">× {row.quantity}</span>
                            </span>
                            <span className="font-medium text-ink">{formatPrice(row.total_price)}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-paper-line pt-3 text-sm font-semibold">
                    <span>Order total</span>
                    <span>{formatPrice(header.total_amount)}</span>
                </div>

                {/* Update the current order status */}
                <div className="mt-6 border-t border-paper-line pt-5">

                    <p className="mb-2 text-sm font-medium text-ink-soft">Update status</p>

                    <select
                        value=""
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isUpdating}
                        className="rounded-lg border border-paper-line bg-paper px-3 py-2 text-sm text-ink-soft focus:border-plum-500 focus:outline-none disabled:opacity-50"
                    >
                        <option value="">Change status…</option>
                        {STATUS_OPTIONS.filter((s) => s !== header.order_status).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                </div>
            </div>
        </div>
    );
}