import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";
import { useSellerAuth } from "../../context/SellerAuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

export default function Profile() {
	useDocumentTitle("Your profile");
	const { user, isLoading, refresh } = useSellerAuth();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm();

	useEffect(() => {
		if (user) {
			reset({ sellerName: user.seller_name || "", mobile: user.mobile || "", gstin: "" });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]);

	async function onSubmit(values) {
		try {
			await axiosInstance.patch(SELLER.UPDATE_PROFILE, values);
			toast.success("Profile updated");
			refresh();
		} catch (err) {
			toast.error(err.friendlyMessage || "Failed to update profile.");
		}
	}

	if (isLoading || !user) return <Loader fullScreen label="Loading your profile…" />;

	return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-2xl bg-paper-raised p-6 shadow-card border border-paper-line space-y-8">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-ink">
                        Welcome, {user?.seller_name || "Seller"}
                    </h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Welcome to your profile. Manage your seller account information here.
                    </p>
                </div>
    
                <div className="rounded-xl bg-paper p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-ink-muted">Email</span>
                        <span className="text-sm font-medium text-ink">
                            {user.email}
                        </span>
                    </div>
    
                    <div className="flex justify-between">
                        <span className="text-sm text-ink-muted">Account Type</span>
                        <span className="text-sm font-medium text-teal-600">
                            Seller
                        </span>
                    </div>
    
                    <div className="flex justify-between">
                        <span className="text-sm text-ink-muted">Status</span>
                        <span className="text-sm font-medium text-green-600">
                            Active
                        </span>
                    </div>
                </div>
    
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Seller / display name"
                        error={errors.sellerName?.message}
                        {...register("sellerName", {
                            required: "Required",
                            minLength: {
                                value: 3,
                                message: "At least 3 characters",
                            },
                        })}
                    />
    
                    <Input label="Email" value={user.email || ""} disabled />
    
                    <Input
                        label="Mobile"
                        type="tel"
                        error={errors.mobile?.message}
                        {...register("mobile", {
                            required: "Mobile number is required",
                        })}
                    />
    
                    <Input
                        label="GSTIN"
                        hint="Re-enter your GSTIN each time you save — it isn't shown here for confirmation."
                        error={errors.gstin?.message}
                        {...register("gstin", {
                            required: "GSTIN is required to save changes",
                            pattern: {
                                value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
                                message: "Enter a valid GSTIN",
                            },
                        })}
                    />
    
                        <div className="flex justify-center">
                        <Button
                            type="submit"
                            variant="teal"
                            isLoading={isSubmitting}
                            disabled={!isDirty}
                        >
                            Save changes
                        </Button>
                    </div>
                </form>
    
                <Link
                    to="/seller/change-password"
                    className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                    <KeyRound size={16} />
                    Change password
                </Link>
            </div>
        </div>
    );
}
