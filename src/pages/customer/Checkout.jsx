import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_ADDRESSES, CUSTOMER_CART, CUSTOMER_ORDERS, CUSTOMER_PAYMENTS } from "../../api/endpoints";
import { PAYMENT_METHODS } from "../../utils/constants";
import { effectivePrice, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import AddressCard from "../../components/customer/AddressCard";

const PAYMENT_LABELS = {
  COD: "Cash on delivery",
  UPI: "UPI",
  CARD: "Credit / Debit card",
  NETBANKING: "Net banking",
};

export default function Checkout() {
  useDocumentTitle("Checkout");
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const [cartRes, addressesRes] = await Promise.all([
        axiosInstance.get(CUSTOMER_CART.BASE),
        axiosInstance.get(CUSTOMER_ADDRESSES.BASE),
      ]);
      setCart(cartRes.data.cart || []);
      const loadedAddresses = addressesRes.data.addresses || [];
      setAddresses(loadedAddresses);
      const defaultAddress = loadedAddresses.find((a) => a.is_default) || loadedAddresses[0];
      if (defaultAddress) setSelectedAddressId(defaultAddress.id);
    } catch (err) {
      setError(err.friendlyMessage || "Failed to load checkout.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePlaceOrder() {
    setIsPlacingOrder(true);
    try {
      const orderRes = await axiosInstance.post(CUSTOMER_ORDERS.BASE);
      const { orderId } = orderRes.data;

      try {
        await axiosInstance.post(CUSTOMER_PAYMENTS.BASE, { orderId, paymentMethod });
      } catch (paymentErr) {
        // The order itself succeeded — surface the payment failure but still
        // route to the order so the customer can retry payment from there.
        toast.error(paymentErr.friendlyMessage || "Order placed, but payment failed.");
        navigate(`/orders/${orderId}`);
        return;
      }

      toast.success("Order placed successfully!");
      navigate(`/orders/${orderId}`);
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  }

  if (isLoading) return <Loader fullScreen label="Loading checkout…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  if (cart.length === 0) {
    return (
      <ErrorMessage
        message="Your cart is empty — add something before checking out."
        onRetry={() => navigate("/products")}
      />
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + effectivePrice(item) * item.quantity, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h1 className="font-display text-2xl font-semibold text-ink">Checkout</h1>
          </div>

          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Delivery address
          </h2>
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-paper-line bg-paper-raised/60 p-5 text-sm text-ink-muted">
              You don&apos;t have a saved address yet.{" "}
              <Link to="/account/addresses" className="font-medium text-teal-600 hover:text-teal-700">
                Add one
              </Link>{" "}
              before placing your order.
            </div>
          ) : (
            <div className="space-y-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  selectable
                  selected={selectedAddressId === address.id}
                  onSelect={(a) => setSelectedAddressId(a.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Payment method
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={[
                  "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                  paymentMethod === method
                    ? "border-gold-500 bg-gold-50/40 text-ink"
                    : "border-paper-line text-ink-soft hover:border-ink/20",
                ].join(" ")}
              >
                {PAYMENT_LABELS[method]}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="h-fit space-y-4 rounded-2xl border border-paper-line bg-paper-raised p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>
        <ul className="space-y-2 text-sm">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="text-ink-soft">
                {item.title} <span className="text-ink-muted">× {item.quantity}</span>
              </span>
              <span className="shrink-0 font-medium text-ink">
                {formatPrice(effectivePrice(item) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-paper-line pt-3 text-sm font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Button
          fullWidth
          onClick={handlePlaceOrder}
          isLoading={isPlacingOrder}
          disabled={addresses.length === 0}
        >
          Place order
        </Button>
      </div>
    </div>
  );
}
