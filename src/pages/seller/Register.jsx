import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const STEPS = ["email", "otp", "details"];

function SectionHeading({ children }) {
    return (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            {children}
        </h2>
    );
}

export default function Register() {
    useDocumentTitle("Seller registration");
    const navigate = useNavigate();

    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [isResending, setIsResending] = useState(false);

    const emailForm = useForm();
    const otpForm = useForm();
    const detailsForm = useForm();

    async function submitEmail(values) {
        try {
            await axiosInstance.post(SELLER.SEND_OTP, { email: values.email });
            setEmail(values.email);
            setStep("otp");
            toast.success("OTP sent to your email");
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to send OTP.");
        }
    }

    async function submitOtp(values) {
        try {
            const res = await axiosInstance.post(SELLER.VERIFY_OTP, { email, otp: values.otp });
            setVerificationToken(res.data.verificationToken);
            setStep("details");
            toast.success("Email verified");
        } catch (err) {
            toast.error(err.friendlyMessage || "OTP verification failed.");
        }
    }

    async function resendOtp() {
        setIsResending(true);
        try {
            await axiosInstance.post(SELLER.SEND_OTP, { email });
            toast.success("OTP resent");
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to resend OTP.");
        } finally {
            setIsResending(false);
        }
    }

    async function submitDetails(values) {
        if (values.password !== values.confirmPassword) {
            detailsForm.setError("confirmPassword", { message: "Passwords do not match" });
            return;
        }
        try {
            await axiosInstance.post(
                SELLER.REGISTER,
                {
                    seller_name: values.seller_name,
                    email,
                    mobile: values.mobile,
                    passwordd: values.password,
                    gstin: values.gstin,
                    address: {
                        address_line1: values.address_line1,
                        address_line2: values.address_line2,
                        city: values.city,
                        state: values.state,
                        pincode: values.pincode,
                        country: values.country,
                    },
                    business: {
                        business_name: values.business_name,
                        business_email: values.business_email,
                        business_mobile: values.business_mobile,
                        business_type: values.business_type,
                        business_address: values.business_address,
                        pan_number: values.pan_number,
                    },
                    bank: {
                        account_holder_name: values.account_holder_name,
                        account_number: values.account_number,
                        bank_name: values.bank_name,
                        ifsc_code: values.ifsc_code,
                    },
                },
                { headers: { Authorization: `Bearer ${verificationToken}` } },
            );
            toast.success("Registration submitted — you can now sign in.");
            navigate("/seller/login");
        } catch (err) {
            toast.error(err.friendlyMessage || "Registration failed.");
        }
    }

    const stepIndex = STEPS.indexOf(step);

    return (
        <div className="flex justify-center px-4 py-10">
            <div className="w-full max-w-3xl rounded-3xl border border-teal-300/20 bg-teal-50/10 px-6 py-5 shadow-xl backdrop-blur-lg">
                <div className="mx-auto max-w-2xl px-4 py-10">
                    <h1 className="text-center font-display text-2xl font-semibold text-ink">
                        Become a MarketHive seller
                    </h1>
                    <p className="mt-1 text-center text-sm text-ink-muted">
                        Step {stepIndex + 1} of {STEPS.length}
                    </p>

                    {step === "email" ? (
                        <form onSubmit={emailForm.handleSubmit(submitEmail)} className="mx-auto mt-8 max-w-sm space-y-4">
                            <Input
                                label="Business email"
                                type="email"
                                error={emailForm.formState.errors.email?.message}
                                {...emailForm.register("email", { required: "Email is required" })}
                            />
                            <Button type="submit" variant="teal" fullWidth isLoading={emailForm.formState.isSubmitting}>
                                Send OTP
                            </Button>
                            <p className="text-center text-sm text-ink-muted">
                                Already registered?{" "}
                                <Link to="/seller/login" className="font-medium text-teal-600 hover:text-teal-700">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    ) : null}

                    {step === "otp" ? (
                        <form onSubmit={otpForm.handleSubmit(submitOtp)} className="mx-auto mt-8 max-w-sm space-y-4">
                            <p className="text-center text-sm text-ink-muted">Enter the OTP sent to {email}</p>
                            <Input
                                label="OTP"
                                inputMode="numeric"
                                error={otpForm.formState.errors.otp?.message}
                                {...otpForm.register("otp", { required: "OTP is required" })}
                            />
                            <Button type="submit" variant="teal" fullWidth isLoading={otpForm.formState.isSubmitting}>
                                Verify email
                            </Button>
                            <button
                                type="button"
                                onClick={resendOtp}
                                disabled={isResending}
                                className="w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700 disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
                        </form>
                    ) : null}

                    {step === "details" ? (
                        <form onSubmit={detailsForm.handleSubmit(submitDetails)} className="mt-8 space-y-8">
                            <section>
                                <SectionHeading>Account</SectionHeading>
                                <div className="space-y-4">
                                    <Input
                                        label="Seller / display name"
                                        hint="3–100 characters"
                                        error={detailsForm.formState.errors.seller_name?.message}
                                        {...detailsForm.register("seller_name", {
                                            required: "Seller name is required",
                                            minLength: { value: 3, message: "At least 3 characters" },
                                        })}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="Mobile"
                                            type="tel"
                                            error={detailsForm.formState.errors.mobile?.message}
                                            {...detailsForm.register("mobile", { required: "Mobile number is required" })}
                                        />
                                        <Input
                                            label="GSTIN"
                                            hint="15-character GST number"
                                            error={detailsForm.formState.errors.gstin?.message}
                                            {...detailsForm.register("gstin", {
                                                required: "GSTIN is required",
                                                pattern: {
                                                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
                                                    message: "Enter a valid GSTIN",
                                                },
                                            })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="Password"
                                            type="password"
                                            error={detailsForm.formState.errors.password?.message}
                                            {...detailsForm.register("password", {
                                                required: "Password is required",
                                                minLength: { value: 8, message: "At least 8 characters" },
                                            })}
                                        />
                                        <Input
                                            label="Confirm password"
                                            type="password"
                                            error={detailsForm.formState.errors.confirmPassword?.message}
                                            {...detailsForm.register("confirmPassword", { required: "Please confirm your password" })}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeading>Pickup address</SectionHeading>
                                <div className="space-y-4">
                                    <Input
                                        label="Address line 1"
                                        error={detailsForm.formState.errors.address_line1?.message}
                                        {...detailsForm.register("address_line1", { required: "Required" })}
                                    />
                                    <Input label="Address line 2 (optional)" {...detailsForm.register("address_line2")} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="City"
                                            error={detailsForm.formState.errors.city?.message}
                                            {...detailsForm.register("city", { required: "Required" })}
                                        />
                                        <Input
                                            label="State"
                                            error={detailsForm.formState.errors.state?.message}
                                            {...detailsForm.register("state", { required: "Required" })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="Pincode"
                                            error={detailsForm.formState.errors.pincode?.message}
                                            {...detailsForm.register("pincode", { required: "Required" })}
                                        />
                                        <Input
                                            label="Country"
                                            defaultValue="India"
                                            {...detailsForm.register("country")}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeading>Business details</SectionHeading>
                                <div className="space-y-4">
                                    <Input
                                        label="Business name"
                                        error={detailsForm.formState.errors.business_name?.message}
                                        {...detailsForm.register("business_name", { required: "Required" })}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="Business email (optional)" type="email" {...detailsForm.register("business_email")} />
                                        <Input label="Business mobile (optional)" type="tel" {...detailsForm.register("business_mobile")} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="Business type (optional)" placeholder="e.g. Proprietorship" {...detailsForm.register("business_type")} />
                                        <Input label="PAN number (optional)" {...detailsForm.register("pan_number")} />
                                    </div>
                                    <Input label="Business address (optional)" {...detailsForm.register("business_address")} />
                                </div>
                            </section>

                            <section>
                                <SectionHeading>Bank details</SectionHeading>
                                <div className="space-y-4">
                                    <Input
                                        label="Account holder name"
                                        error={detailsForm.formState.errors.account_holder_name?.message}
                                        {...detailsForm.register("account_holder_name", { required: "Required" })}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="Account number"
                                            error={detailsForm.formState.errors.account_number?.message}
                                            {...detailsForm.register("account_number", { required: "Required" })}
                                        />
                                        <Input
                                            label="IFSC code"
                                            error={detailsForm.formState.errors.ifsc_code?.message}
                                            {...detailsForm.register("ifsc_code", { required: "Required" })}
                                        />
                                    </div>
                                    <Input
                                        label="Bank name"
                                        error={detailsForm.formState.errors.bank_name?.message}
                                        {...detailsForm.register("bank_name", { required: "Required" })}
                                    />
                                </div>
                            </section>

                            <Button type="submit" variant="teal" fullWidth isLoading={detailsForm.formState.isSubmitting}>
                                Complete registration
                            </Button>
                        </form>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
