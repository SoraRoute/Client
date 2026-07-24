// Customer Frontend
// Author: Nishtha

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Register() {
    useDocumentTitle("Create account");
    const navigate = useNavigate();

    const [step, setStep] = useState("details"); // "details" | "otp"
    const [pendingCustomer, setPendingCustomer] = useState(null);
    const [isResending, setIsResending] = useState(false);

    const detailsForm = useForm();
    const otpForm = useForm();

    async function submitDetails(values) {
        // Prevent registration if both passwords don't match.
        if (values.password !== values.confirmPassword) {
            detailsForm.setError("confirmPassword", { message: "Passwords do not match" });
            return;
        }

        try {
            // Send an OTP to verify the customer's email.
            await axiosInstance.post(CUSTOMER.REGISTER, { email: values.email });

            setPendingCustomer(values);
            setStep("otp");

            toast.success("OTP sent to your email");

        } catch (err) {
            toast.error(err.friendlyMessage || "Registration failed.");
        }
    }

    async function submitOtp(values) {
        try {
            // Complete registration after successful OTP verification.
            await axiosInstance.post(CUSTOMER.VERIFY_EMAIL, {
                first_name: pendingCustomer.first_name,
                last_name: pendingCustomer.last_name,
                email: pendingCustomer.email,
                mobile: pendingCustomer.mobile,
                password: pendingCustomer.password,
                otp: values.otp,
            });

            toast.success("Account created — sign in to continue.");

            navigate("/login");

        } catch (err) {
            toast.error(err.friendlyMessage || "OTP verification failed.");
        }
    }

    async function resendOtp() {
        setIsResending(true);

        try {
            // Request a fresh OTP using the same email.
            await axiosInstance.post(CUSTOMER.REGISTER, { email: pendingCustomer.email });

            toast.success("OTP resent");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to resend OTP.");

        } finally {
            setIsResending(false);
        }
    }

    if (step === "otp") {
        return (
            <div className="flex justify-center py-10">
                <div className="w-full max-w-md rounded-3xl border border-yellow-400/30 bg-yellow-200/15 p-8 shadow-2xl backdrop-blur-lg">

                    <h1 className="text-center font-display text-2xl font-semibold text-ink">
                        Verify your email
                    </h1>

                    <p className="mt-1 text-center text-sm text-ink-muted">
                        Enter the OTP sent to {pendingCustomer?.email}
                    </p>

                    {/* OTP verification form */}
                    <form onSubmit={otpForm.handleSubmit(submitOtp)} className="mt-8 space-y-4">
                        <Input
                            label="OTP"
                            inputMode="numeric"
                            error={otpForm.formState.errors.otp?.message}
                            {...otpForm.register("otp", { required: "OTP is required" })}
                        />

                        <Button type="submit" fullWidth isLoading={otpForm.formState.isSubmitting}>
                            Verify & create account
                        </Button>
                    </form>

                    <button
                        type="button"
                        onClick={resendOtp}
                        disabled={isResending}
                        className="mt-4 w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700 disabled:opacity-50"
                    >
                        Resend OTP
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="mt-2 w-full text-center text-sm text-ink-muted hover:text-ink"
                    >
                        Back to details
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-md rounded-3xl border border-yellow-400/30 bg-yellow-200/15 p-8 shadow-2xl backdrop-blur-lg">

                <h1 className="text-center font-display text-2xl font-semibold text-ink">
                    Create your account
                </h1>

                <p className="mt-1 text-center text-sm text-ink-muted">
                    Join MarketHive in a minute
                </p>

                {/* Customer registration form */}
                <form onSubmit={detailsForm.handleSubmit(submitDetails)} className="mt-8 space-y-4">

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="First name"
                            error={detailsForm.formState.errors.first_name?.message}
                            {...detailsForm.register("first_name", { required: "Required" })}
                        />

                        <Input
                            label="Last name"
                            error={detailsForm.formState.errors.last_name?.message}
                            {...detailsForm.register("last_name", { required: "Required" })}
                        />
                    </div>

                    <Input
                        label="Email"
                        type="email"
                        error={detailsForm.formState.errors.email?.message}
                        {...detailsForm.register("email", { required: "Email is required" })}
                    />

                    <Input
                        label="Mobile"
                        type="tel"
                        error={detailsForm.formState.errors.mobile?.message}
                        {...detailsForm.register("mobile", { required: "Mobile number is required" })}
                    />

                    <Input
                        label="Password"
                        type="password"
                        error={detailsForm.formState.errors.password?.message}
                        {...detailsForm.register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "At least 6 characters" },
                        })}
                    />

                    <Input
                        label="Confirm password"
                        type="password"
                        error={detailsForm.formState.errors.confirmPassword?.message}
                        {...detailsForm.register("confirmPassword", { required: "Please confirm your password" })}
                    />

                    <Button type="submit" fullWidth isLoading={detailsForm.formState.isSubmitting}>
                        Send OTP
                    </Button>

                </form>

                <p className="mt-6 text-center text-sm text-ink-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}