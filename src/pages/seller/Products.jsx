import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { PRODUCTS } from "../../api/endpoints";
import { formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

export default function Products() {
	useDocumentTitle("Your products");

	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [pendingId, setPendingId] = useState(null);

	async function load() {
		setIsLoading(true);
		setError("");
		try {
			const res = await axiosInstance.get(PRODUCTS.MY_PRODUCTS);
			setProducts(res.data.data || []);
		} catch (err) {
			setError(err.friendlyMessage || "Failed to load your products.");
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	async function toggleStatus(product) {
		const nextStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
		setPendingId(product.id);

		try {
			await axiosInstance.patch(PRODUCTS.STATUS(product.id), { status: nextStatus });
			setProducts((prev) =>
				prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p)),
			);
			toast.success(nextStatus === "ACTIVE" ? "Product activated" : "Product deactivated");

		} catch (err) {
			toast.error(err.friendlyMessage || "Failed to update status.");

		} finally {
			setPendingId(null);
		}
	}

	async function handleDelete(product) {
		if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;

		try {
			await axiosInstance.delete(PRODUCTS.BY_ID(product.id));
			setProducts((prev) => prev.filter((p) => p.id !== product.id));
			toast.success("Product deleted");
			
		} catch (err) {
			toast.error(err.friendlyMessage || "Failed to delete product.");
		}
	}

	if (isLoading) return <Loader fullScreen label="Loading your products…" />;
	if (error) return <ErrorMessage message={error} onRetry={load} />;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display text-2xl font-semibold text-ink">Your products</h1>
				<Link to="/seller/products/new">
					<Button variant="teal" icon={Plus} size="sm">
						Add product
					</Button>
				</Link>
			</div>

			{products.length === 0 ? (
				<EmptyState
					icon={Package}
					title="No products yet"
					description="List your first product to start selling on MarketHive."
					action={
						<Link to="/seller/products/new">
							<Button variant="teal">Add your first product</Button>
						</Link>
					}
				/>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-paper-line bg-paper-raised">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-paper-line text-left text-xs uppercase tracking-wide text-ink-muted">
								<th className="px-4 py-3 font-medium">Product</th>
								<th className="px-4 py-3 font-medium">Price</th>
								<th className="px-4 py-3 font-medium">Stock</th>
								<th className="px-4 py-3 font-medium">Status</th>
								<th className="px-4 py-3 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product.id} className="border-b border-paper-line last:border-none">
									<td className="px-4 py-3">
										<p className="line-clamp-1 font-medium text-ink">{product.title}</p>
										{product.brand ? <p className="text-xs text-ink-muted">{product.brand}</p> : null}
									</td>
									<td className="px-4 py-3 text-ink-soft">{formatPrice(product.price)}</td>
									<td className="px-4 py-3 text-ink-soft">{product.stock}</td>
									<td className="px-4 py-3">
										<button
											type="button"
											onClick={() => toggleStatus(product)}
											disabled={pendingId === product.id}
											className="disabled:opacity-50"
											title="Click to toggle status"
										>
											<StatusBadge status={product.status} />
										</button>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center justify-end gap-1">
											<Link
												to={`/seller/products/${product.id}/edit`}
												className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
												aria-label="Edit product"
											>
												<Pencil size={14} />
											</Link>
											<button
												type="button"
												onClick={() => handleDelete(product)}
												className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-danger-50 hover:text-danger-500"
												aria-label="Delete product"
											>
												<Trash2 size={14} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
