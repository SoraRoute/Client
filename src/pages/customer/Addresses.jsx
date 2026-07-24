import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_ADDRESSES } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import AddressCard from "../../components/customer/AddressCard";
import AddressForm from "../../components/customer/AddressForm";

export default function Addresses() {
    useDocumentTitle("Your addresses");

    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function load() {
        setIsLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(CUSTOMER_ADDRESSES.BASE);
            setAddresses(res.data.addresses || []);
        } catch (err) {
            setError(err.friendlyMessage || "Failed to load your addresses.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function openAddModal() {
        setEditingAddress(null);
        setModalOpen(true);
    }

    function openEditModal(address) {
        setEditingAddress(address);
        setModalOpen(true);
    }

    async function handleSubmit(values) {
        setIsSubmitting(true);
        try {
            if (editingAddress) {
                await axiosInstance.patch(CUSTOMER_ADDRESSES.BY_ID(editingAddress.id), values);
                toast.success("Address updated");
            } else {
                await axiosInstance.post(CUSTOMER_ADDRESSES.BASE, values);
                toast.success("Address added");
            }
            setModalOpen(false);
            load();
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to save address.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(address) {
        if (!window.confirm("Delete this address?")) return;
        try {
            await axiosInstance.delete(CUSTOMER_ADDRESSES.BY_ID(address.id));
            toast.success("Address deleted");
            load();
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to delete address.");
        }
    }

    if (isLoading) return <Loader fullScreen label="Loading your addresses…" />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl font-semibold text-ink">Your addresses</h1>
                <Button icon={Plus} size="sm" onClick={openAddModal}>
                    Add address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="No addresses saved"
                    description="Add a delivery address to speed up checkout."
                    action={<Button onClick={openAddModal}>Add your first address</Button>}
                />
            ) : (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <Modal
                open={modalOpen}
                title={editingAddress ? "Edit address" : "Add address"}
                onClose={() => setModalOpen(false)}
            >
                <AddressForm
                    initialValues={editingAddress}
                    onSubmit={handleSubmit}
                    onCancel={() => setModalOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </div>
    );
}
