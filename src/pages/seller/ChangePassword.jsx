import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

// API & Constants
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";

// Hooks & Components
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";


export default function ChangePassword() {

    //Sets browser page title
    useDocumentTitle("Change Password");

    const navigate = useNavigate();


    // React Hook Form setup
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

    /**
     * Handle password change submission
     * 
     * Steps:
     * 1. Validate new password and confirm password
     * 2. Send request to backend API
     * 3. Show success/error message
     * 4. Redirect user back to profile
     */

    async function handleChangePassword(formData) {
        const {
            oldPassword,
            newPassword,
            confirmPassword,
        } = formData;

        // Check if new password matches confirm password
        if (newPassword !== confirmPassword) {
            setError("confirmPassword", {
                message: "Passwords do not match",
            });

            return;
        }

        try {
            // Call change password API
            await axiosInstance.patch(SELLER.CHANGE_PASSWORD, {
                oldPassword,
                newPassword,
            });

            // Show success notification
            toast.success("Password changed successfully");

            // Navigate back to seller profile
            navigate("/seller/profile");

        } catch (error) {
            // Show API error message
            toast.error(
                error?.friendlyMessage || "Failed to change password"
            );
        }
    }

    return (
        <div className="mx-auto max-w-sm space-y-6">

            <Link
                to="/seller/profile"
                className="
			flex items-center gap-1 
			text-sm text-ink-muted 
			hover:text-ink
			"
            >
                <ChevronLeft size={14} />
                Your profile
            </Link>

            <h1 className="font-display text-2xl font-semibold text-ink">
                Change Password
            </h1>

            <form
                onSubmit={handleSubmit(handleChangePassword)}
                className="space-y-4"
            >
                <Input
                    label="Current password"
                    type="password"
                    error={errors.oldPassword?.message}
                    {...register("oldPassword", {
                        required: "Current password is required",
                    })}
                />

                <Input
                    label="New password"
                    type="password"
                    hint="At least 8 characters, with upper, lower, number & symbol"
                    error={errors.newPassword?.message}

                    {...register("newPassword", {
                        required: "New password is required",

                        minLength: {
                            value: 8,
                            message: "Password must contain at least 8 characters",
                        },

                        pattern: {
                            value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,

                            message:
                                "Password must include uppercase, lowercase, number & special character",
                        },

                    })}
                />

                <Input
                    label="Confirm new password"
                    type="password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword", {
                        required: "Please confirm your new password",
                    })}
                />

                <Button
                    type="submit"
                    variant="teal"
                    fullWidth
                    isLoading={isSubmitting}
                >
                    Change Password
                </Button>


            </form>
        </div>
    );
}