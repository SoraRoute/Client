// Customer Frontend
// Author: Nishtha

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_CART } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { effectivePrice, formatPrice } from "../../utils/format";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import QuantityStepper from "../../components/customer/QuantityStepper";

export default function Cart() {
    useDocumentTitle("Cart");
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingProductId, setPendingProductId] = useState(null);

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            // Fetch the customer's current cart.
            const res = await axiosInstance.get(CUSTOMER_CART.BASE);
            setItems(res.data.cart || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load your cart.");

        } finally {
            setIsLoading(false);
        }
    }

    // Load cart items when the page opens.
    useEffect(() => {
        load();
    }, []);

    async function updateQuantity(productId, quantity) {
        setPendingProductId(productId);

        // Optimistic update so the stepper feels instant.
        setItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)));

        try {
            await axiosInstance.patch(CUSTOMER_CART.ITEM(productId), { quantity });

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update quantity.");

            // Restore the latest cart state if the request fails.
            load();

        } finally {
            setPendingProductId(null);
        }
    }

    async function removeItem(productId) {
        try {
            await axiosInstance.delete(CUSTOMER_CART.ITEM(productId));

            // Remove the item locally after a successful request.
            setItems((prev) => prev.filter((item) => item.id !== productId));

            toast.success("Removed from cart");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to remove item.");
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading your cart…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    if (items.length === 0) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="Your cart is empty"
                description="Browse the shop and add something you like."
                action={
                    <Link to="/products">
                        <Button>Start shopping</Button>
                    </Link>
                }
            />
        );
    }

    // Calculate the total before checkout.
    const subtotal = items.reduce((sum, item) => sum + effectivePrice(item) * item.quantity, 0);

    return (
        <div className="grid gap-8 lg:grid-cols-3">

            {/* Cart items */}
            <div className="space-y-3 lg:col-span-2">
                <h1 className="font-display text-2xl font-semibold text-ink">Your cart</h1>

                {items.map((item) => {
                    const price = effectivePrice(item);

                    return (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-2xl border border-paper-line bg-paper-raised p-4"
                        >
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-50 to-paper-line">
                                <span className="font-display text-xl font-semibold text-gold-600/70">
                                    {(item.title || "?").charAt(0).toUpperCase()}
                                </span>
                            </div>

                            <div className="min-w-0 flex-1">
                                <Link to={`/products/${item.id}`} className="line-clamp-1 font-medium text-ink hover:underline">
                                    {item.title}
                                </Link>
                                {item.brand ? <p className="text-xs text-ink-muted">{item.brand}</p> : null}
                                <p className="mt-1 text-sm font-semibold text-ink">{formatPrice(price)}</p>
                            </div>

                            <QuantityStepper
                                value={item.quantity}
                                onChange={(qty) => updateQuantity(item.id, qty)}
                                disabled={pendingProductId === item.id}
                            />

                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-danger-50 hover:text-danger-500"
                                aria-label="Remove item"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Order summary */}
            <div className="h-fit rounded-2xl border border-paper-line bg-paper-raised p-5">
                <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>

                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">Subtotal</span>
                    <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
                </div>

                <p className="mt-1 text-xs text-ink-muted">Shipping and taxes calculated at checkout.</p>

                <Button fullWidth className="mt-5" onClick={() => navigate("/checkout")}>
                    Proceed to checkout
                </Button>
            </div>
        </div>
    );
}