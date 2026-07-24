import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";
import { useSellerAuth } from "../../context/SellerAuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
    useDocumentTitle("Seller sign in");
    const navigate = useNavigate();
    const { refresh } = useSellerAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    async function onSubmit(values) {
        try {
            // The sellers table's password column is named "passwordd" (typo
            // baked into the schema) — the login endpoint expects that exact key.
            await axiosInstance.post(SELLER.LOGIN, {
                email: values.email,
                passwordd: values.password,
            });
            await refresh();
            toast.success("Welcome back!");
            navigate("/seller/dashboard", { replace: true });
        } catch (err) {
            toast.error(err.friendlyMessage || "Login failed.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-teal-300/30 bg-teal-100/15 p-8 shadow-2xl backdrop-blur-lg">
                <h1 className="text-center font-display text-2xl font-semibold text-ink">
                    Seller sign in
                </h1>

                <p className="mt-1 text-center text-sm text-ink-muted">
                    Manage your MarketHive storefront
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        error={errors.email?.message}
                        {...register("email", { required: "Email is required" })}
                    />

                    <Input
                        label="Password"
                        type="password"
                        error={errors.password?.message}
                        {...register("password", { required: "Password is required" })}
                    />

                    <div className="flex justify-end">
                        <Link
                            to="/seller/forgot-password"
                            className="text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="teal"
                        fullWidth
                        isLoading={isSubmitting}
                    >
                        Sign in
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-ink-muted">
                    New seller?{" "}
                    <Link
                        to="/seller/register"
                        className="font-medium text-teal-600 hover:text-teal-700"
                    >
                        Register your business
                    </Link>
                </p>
            </div>
        </div>
    );
}
