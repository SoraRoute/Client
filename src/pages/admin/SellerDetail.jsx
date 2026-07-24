import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN_SELLERS } from "../../api/endpoints";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";

const STATUS_OPTIONS = ["PENDING", "ACTIVE", "SUSPENDED"];

function Field({ label, value }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
            <p className="mt-0.5 text-sm text-ink">{value || "—"}</p>
        </div>
    );
}

export default function SellerDetail() {
    const { sellerId } = useParams();
    useDocumentTitle("Seller details");

    const [seller, setSeller] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    async function load() {

        setIsLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(ADMIN_SELLERS.BY_ID(sellerId));
            setSeller(res.data.data);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load this seller.");

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sellerId]);

    async function handleStatusChange(nextStatus) {
        if (!nextStatus || nextStatus === seller.account_status) return;

        setIsUpdating(true);

        try {
            await axiosInstance.patch(ADMIN_SELLERS.STATUS(sellerId), { account_status: nextStatus });
            setSeller((prev) => ({ ...prev, account_status: nextStatus }));
            toast.success("Seller status updated");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update status.");

        } finally {
            setIsUpdating(false);
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading seller…" />;

    if (error || !seller) return <ErrorMessage message={error || "Seller not found."} onRetry={load} />;

    return (
        <div className="mx-auto max-w-lg space-y-6">

            <Link to="/admin/sellers" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
                <ChevronLeft size={14} /> All sellers
            </Link>

            <div className="rounded-2xl border border-paper-line bg-paper-raised p-6">

                <div className="flex items-center justify-between">
                    <h1 className="font-display text-xl font-semibold text-ink">{seller.seller_name}</h1>
                    <StatusBadge status={seller.account_status} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <Field label="Email" value={seller.email} />
                    <Field label="Mobile" value={seller.mobile} />
                    <Field label="GSTIN" value={seller.gstin} />
                    <Field label="Joined" value={formatDate(seller.created_at)} />
                </div>

                <div className="mt-6 border-t border-paper-line pt-5">

                    <p className="mb-2 text-sm font-medium text-ink-soft">Update account status</p>

                    <div className="flex gap-2">

                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status}
                                type="button"
                                disabled={isUpdating || status === seller.account_status}
                                onClick={() => handleStatusChange(status)}
                                className={[
                                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40",
                                    status === seller.account_status
                                        ? "border-plum-500 bg-plum-50 text-plum-700"
                                        : "border-paper-line text-ink-soft hover:border-plum-500",
                                ].join(" ")}
                            >
                                {status}
                            </button>
                            
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
