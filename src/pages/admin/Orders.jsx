import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN_ORDERS } from "../../api/endpoints";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

export default function Orders() {
  useDocumentTitle("Orders");

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(ADMIN_ORDERS.BASE);
      setOrders(res.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (isLoading) return <Loader fullScreen label="Loading orders…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  if (orders.length === 0) {
    return <EmptyState icon={Receipt} title="No orders yet" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>

      <div className="overflow-x-auto rounded-2xl border border-paper-line bg-paper-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-b border-paper-line last:border-none">
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${order.order_id}`} className="font-medium text-ink hover:underline">
                    #{order.order_id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {order.first_name} {order.last_name}
                  <p className="text-xs text-ink-muted">{order.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-soft">{formatPrice(order.total_amount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.order_status} />
                </td>
                <td className="px-4 py-3 text-ink-soft">{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
