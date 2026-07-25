
// Author: Nishtha and Pinki

import { useEffect, useState } from "react";
import { LayoutGrid, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CATEGORIES } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import CategoryForm from "../../components/admin/categoryForm";

export default function Categories() {
    useDocumentTitle("Categories");

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingId, setPendingId] = useState(null);

    async function load() {

        setIsLoading(true);
        setError("");

        try {
            // Fetch all categories for the admin table.
            const res = await axiosInstance.get(CATEGORIES.ADMIN_LIST);
            setCategories(res.data.data || []);

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load categories.");

        } finally {
            setIsLoading(false);
        }
    }

    // Load categories when the page opens.
    useEffect(() => {
        load();
    }, []);

    function openAddModal() {
        setEditingCategory(null);
        setModalOpen(true);
    }

    function openEditModal(category) {
        // Populate the form with the selected category.
        setEditingCategory({
            id: category.id,
            name: category.name,
            description: category.description || "",
            parent_category_id: category.parent_category_id ? String(category.parent_category_id) : "",
            status: category.status,
        });

        setModalOpen(true);
    }

    async function handleSubmit(values) {

        setIsSubmitting(true);

        try {
            if (editingCategory) {
                await axiosInstance.put(CATEGORIES.BY_ID(editingCategory.id), values);
                toast.success("Category updated");
            } else {
                await axiosInstance.post(CATEGORIES.CREATE, values);
                toast.success("Category added");
            }

            setModalOpen(false);
            load();

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to save category.");

        } finally {
            setIsSubmitting(false);
        }
    }

    async function toggleStatus(category) {

        // Switch between ACTIVE and INACTIVE.
        const nextStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setPendingId(category.id);

        try {
            await axiosInstance.patch(CATEGORIES.STATUS(category.id), { status: nextStatus });

            // Update the status locally without reloading the list.
            setCategories((prev) =>
                prev.map((c) => (c.id === category.id ? { ...c, status: nextStatus } : c)),
            );

            toast.success("Status updated");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update status.");

        } finally {
            setPendingId(null);
        }
    }

    async function handleDelete(category) {

        if (!window.confirm(`Delete "${category.name}"?`)) return;

        try {
            await axiosInstance.delete(CATEGORIES.BY_ID(category.id));
            toast.success("Category deleted");
            load();

        } catch (err) {
            // Backend prevents deleting categories that are still in use.
            toast.error(err.friendlyMessage || "Failed to delete category.");
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading categories…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>

                <Button variant="plum" icon={Plus} size="sm" onClick={openAddModal}>
                    Add category
                </Button>
            </div>

            {categories.length === 0 ? (
                <EmptyState
                    icon={LayoutGrid}
                    title="No categories yet"
                    action={<Button variant="plum" onClick={openAddModal}>Add your first category</Button>}
                />
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-paper-line bg-paper-raised">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-paper-line text-left text-xs uppercase tracking-wide text-ink-muted">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Parent</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((category) => {
                                // Find the parent category name, if available.
                                const parent = categories.find((c) => c.id === category.parent_category_id);

                                return (
                                    <tr key={category.id} className="border-b border-paper-line last:border-none">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-ink">{category.name}</p>

                                            {category.description ? (
                                                <p className="line-clamp-1 text-xs text-ink-muted">{category.description}</p>
                                            ) : null}
                                        </td>

                                        <td className="px-4 py-3 text-ink-soft">{parent ? parent.name : "—"}</td>

                                        <td className="px-4 py-3">

                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(category)}
                                                disabled={pendingId === category.id}
                                                className="disabled:opacity-50"
                                                title="Click to toggle status"
                                            >
                                                <StatusBadge status={category.status} />
                                            </button>

                                        </td>

                                        <td className="px-4 py-3">

                                            <div className="flex justify-end gap-1">

                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(category)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
                                                    aria-label="Edit category"
                                                >
                                                    <Pencil size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(category)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-danger-50 hover:text-danger-500"
                                                    aria-label="Delete category"
                                                >
                                                    <Trash2 size={14} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                open={modalOpen}
                title={editingCategory ? "Edit category" : "Add category"}
                onClose={() => setModalOpen(false)}
            >
                <CategoryForm
                    initialValues={editingCategory}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={() => setModalOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </div>
    );
}
