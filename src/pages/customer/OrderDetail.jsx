// Customer Frontend
// Author: Nishtha

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_ORDERS, CUSTOMER_PAYMENTS } from "../../api/endpoints";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

export default function OrderDetail() {
    const { orderId } = useParams();
    useDocumentTitle(`Order #${orderId}`);

    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            // Fetch the selected order details.
            const orderRes = await axiosInstance.get(CUSTOMER_ORDERS.BY_ID(orderId));

            // Note: the backend names this field "orders" even for a single order.
            setOrder(orderRes.data.orders);

            try {
                // Retrieve payment details if available.
                const paymentRes = await axiosInstance.get(CUSTOMER_PAYMENTS.BY_ORDER(orderId));
                setPayment(paymentRes.data.payment);

            } catch {
                // No payment record yet (e.g. payment step failed) — that's fine,
                // the page just won't show a payment status.
                setPayment(null);
            }

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load this order.");

        } finally {
            setIsLoading(false);
        }
    }

    // Reload order details when the order ID changes.
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    async function handleCancel() {
        if (!window.confirm("Cancel this order?")) return;

        setIsCancelling(true);

        try {
            await axiosInstance.delete(CUSTOMER_ORDERS.CANCEL(orderId));

            toast.success("Order cancelled");

            // Refresh the latest order status.
            load();

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to cancel order.");

        } finally {
            setIsCancelling(false);
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading order…" />;
    if (error || !order) return <ErrorMessage message={error || "Order not found."} onRetry={load} />;

    // Only newly placed or confirmed orders can be cancelled.
    const canCancel = order.order_status === "PLACED" || order.order_status === "CONFIRMED";

    return (
        <div className="mx-auto max-w-lg space-y-6">

            <Link to="/orders" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
                <ChevronLeft size={14} /> Your orders
            </Link>

            {/* Order details */}
            <div className="rounded-2xl border border-paper-line bg-paper-raised p-6">

                <div className="flex items-center justify-between">
                    <h1 className="font-display text-xl font-semibold text-ink">Order #{order.id}</h1>
                    <StatusBadge status={order.order_status} />
                </div>

                <p className="mt-1 text-sm text-ink-muted">
                    Placed on {formatDate(order.created_at)}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-paper-line pt-4">
                    <span className="text-sm text-ink-muted">Order total</span>

                    <span className="font-display text-lg font-semibold text-ink">
                        {formatPrice(order.total_amount)}
                    </span>
                </div>

                {payment ? (
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-ink-muted">Payment</span>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-ink-soft">{payment.payment_method}</span>
                            <StatusBadge status={payment.payment_status} />
                        </div>
                    </div>
                ) : null}

                {canCancel ? (
                    <Button
                        variant="outline"
                        fullWidth
                        className="mt-6"
                        onClick={handleCancel}
                        isLoading={isCancelling}
                    >
                        Cancel order
                    </Button>
                ) : null}

            </div>
        </div>
    );
}