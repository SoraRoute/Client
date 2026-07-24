// Seller Frontend
// Author: Pinki

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";
import { formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function Revenue() {
    useDocumentTitle("Revenue");

    const [revenue, setRevenue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            // Fetch the seller's latest revenue summary.
            const res = await axiosInstance.get(SELLER.REVENUE);
            setRevenue(res.data.data);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load revenue.");

        } finally {
            setIsLoading(false);
        }
    }

    // Load revenue details when the page opens.
    useEffect(() => {
        load();
    }, []);

    if (isLoading) return <Loader fullScreen label="Loading revenue…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-semibold text-ink">
                Revenue
            </h1>

            <div className="grid gap-6 md:grid-cols-2">

                {/* Revenue summary */}
                <div
                    className="
                        rounded-2xl
                        border border-paper-line
                        bg-paper-raised
                        p-8
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-[0_10px_35px_rgba(31,111,99,0.18)]
                    "
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-ink-muted">
                                Total Revenue
                            </p>

                            <p className="mt-3 font-display text-4xl font-semibold text-ink">
                                {formatPrice(revenue?.totalRevenue ?? 0)}
                            </p>
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                            <Wallet size={26} strokeWidth={1.8} />
                        </div>
                    </div>

                    <div className="mt-6 border-t border-paper-line pt-4">
                        <p className="text-sm text-ink-muted">
                            Earnings from delivered orders
                        </p>
                    </div>
                </div>

                {/* Additional revenue details */}
                <div
                    className="
                        rounded-2xl
                        border border-paper-line
                        bg-paper-raised
                        p-8
                        transition-all
                        duration-300
                        hover:shadow-[0_10px_35px_rgba(59,130,246,0.15)]
                    "
                >
                    <h2 className="font-display text-lg font-semibold text-ink">
                        Revenue Insights
                    </h2>

                    <div className="mt-5 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-ink-muted">
                                Status
                            </span>

                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
                                Active
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-ink-muted">
                                Payment
                            </span>

                            <span className="text-sm font-medium text-ink">
                                Completed
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-ink-muted">
                                Source
                            </span>

                            <span className="text-sm font-medium text-ink">
                                Delivered Orders
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}