import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN_SELLERS } from "../../api/endpoints";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

const STATUS_OPTIONS = ["PENDING", "ACTIVE", "SUSPENDED"];

export default function Sellers() {
  useDocumentTitle("Sellers");

  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(ADMIN_SELLERS.BASE);
      setSellers(res.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || "Failed to load sellers.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(seller, nextStatus) {
    if (!nextStatus || nextStatus === seller.account_status) return;
    setPendingId(seller.id);
    try {
      await axiosInstance.patch(ADMIN_SELLERS.STATUS(seller.id), { account_status: nextStatus });
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, account_status: nextStatus } : s)),
      );
      toast.success("Seller status updated");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update status.");
    } finally {
      setPendingId(null);
    }
  }

  if (isLoading) return <Loader fullScreen label="Loading sellers…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  if (sellers.length === 0) {
    return <EmptyState icon={Store} title="No sellers yet" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Sellers</h1>

      <div className="overflow-x-auto rounded-2xl border border-paper-line bg-paper-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-medium">Seller</th>
              <th className="px-4 py-3 font-medium">GSTIN</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Update</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-b border-paper-line last:border-none">
                <td className="px-4 py-3">
                  <Link to={`/admin/sellers/${seller.id}`} className="font-medium text-ink hover:underline">
                    {seller.seller_name}
                  </Link>
                  <p className="text-xs text-ink-muted">{seller.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-soft">{seller.gstin}</td>
                <td className="px-4 py-3 text-ink-soft">{formatDate(seller.created_at)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={seller.account_status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <select
                      value=""
                      onChange={(e) => handleStatusChange(seller, e.target.value)}
                      disabled={pendingId === seller.id}
                      className="rounded-lg border border-paper-line bg-paper px-2.5 py-1.5 text-xs text-ink-soft focus:border-plum-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="">Change status…</option>
                      {STATUS_OPTIONS.filter((s) => s !== seller.account_status).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
