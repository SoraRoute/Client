import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER } from "../../api/endpoints";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
    useDocumentTitle("Sign in");
    const navigate = useNavigate();
    const location = useLocation();
    const { refresh } = useCustomerAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    async function onSubmit(values) {
        try {
            await axiosInstance.post(CUSTOMER.LOGIN, values);
            await refresh();
            toast.success("Welcome back!");
            const redirectTo = location.state?.from?.pathname || "/";
            navigate(redirectTo, { replace: true });
        } catch (err) {
            toast.error(err.friendlyMessage || "Login failed.");
        }
    }

    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-md rounded-2xl border border-yellow-300/40 bg-yellow-100/20 p-8 shadow-xl backdrop-blur-md">
                <h1 className="text-center font-display text-2xl font-semibold text-ink">
                    Sign in
                </h1>
                <p className="mt-1 text-center text-sm text-ink-muted">
                    Welcome back to MarketHive
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
                            to="/forgot-password"
                            className="text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth isLoading={isSubmitting}>
                        Sign in
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-ink-muted">
                    New to MarketHive?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-teal-600 hover:text-teal-700"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
