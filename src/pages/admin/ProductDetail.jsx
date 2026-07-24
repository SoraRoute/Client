import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN_PRODUCTS } from "../../api/endpoints";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

function Field({ label, value }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
            <p className="mt-0.5 text-sm text-ink">{value ?? "—"}</p>
        </div>
    );
}

export default function ProductDetail() {

    const { productId } = useParams();
    const navigate = useNavigate();
    useDocumentTitle("Product details");

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    async function load() {

        setIsLoading(true);
        setError("");

        try {
            const res = await axiosInstance.get(ADMIN_PRODUCTS.BY_ID(productId));
            setProduct(res.data.data);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load this product.");

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    async function toggleStatus() {

        const nextStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setIsUpdating(true);

        try {
            await axiosInstance.patch(ADMIN_PRODUCTS.STATUS(productId), { status: nextStatus });
            setProduct((prev) => ({ ...prev, status: nextStatus }));
            toast.success("Status updated");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update status.");

        } finally {
            setIsUpdating(false);
        }
    }

    async function handleDelete() {

        if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;

        try {
            await axiosInstance.delete(ADMIN_PRODUCTS.BY_ID(productId));
            toast.success("Product deleted");
            navigate("/admin/products");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to delete product.");
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading product…" />;

    if (error || !product) return <ErrorMessage message={error || "Product not found."} onRetry={load} />;

    return (

        <div className="mx-auto max-w-lg space-y-6">

            <Link to="/admin/products" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
                <ChevronLeft size={14} /> All products
            </Link>

            <div className="rounded-2xl border border-paper-line bg-paper-raised p-6">

                <div className="flex items-start justify-between gap-3">
                    <h1 className="font-display text-xl font-semibold text-ink">{product.title}</h1>
                    <StatusBadge status={product.status} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">

                    <Field label="Price" value={formatPrice(product.price)} />
                    <Field
                        label="Discount price"
                        value={product.discount_price ? formatPrice(product.discount_price) : "—"}
                    />
                    <Field label="Stock" value={product.stock} />
                    <Field label="Brand" value={product.brand} />
                    <Field label="Seller ID" value={product.seller_id} />
                    <Field label="Category ID" value={product.category_id} />
                    <Field label="Listed" value={formatDate(product.created_at)} />

                </div>

                {product.description ? (

                    <div className="mt-4 border-t border-paper-line pt-4">
                        <p className="text-xs uppercase tracking-wide text-ink-muted">Description</p>
                        <p className="mt-1 text-sm text-ink-soft">{product.description}</p>
                    </div>

                ) : null}

                <div className="mt-6 flex gap-2 border-t border-paper-line pt-5">

                    <Button variant="outline" onClick={toggleStatus} isLoading={isUpdating}>
                        {product.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>

                    <Button variant="danger" icon={Trash2} onClick={handleDelete}>
                        Delete
                    </Button>
                    
                </div>
            </div>
        </div>
    );
}
