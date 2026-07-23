import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ForgotPassword() {
	useDocumentTitle("Seller — forgot password");
	const navigate = useNavigate();
	const [step, setStep] = useState("email");
	const [email, setEmail] = useState("");

	const emailForm = useForm();
	const resetForm = useForm();

	async function submitEmail(values) {
		try {
		await axiosInstance.post(SELLER.FORGOT_PASSWORD, { email: values.email });
		setEmail(values.email);
		setStep("reset");
		toast.success("OTP sent to your email");
		} catch (err) {
		toast.error(err.friendlyMessage || "Failed to send OTP.");
		}
	}

	async function submitReset(values) {
		if (values.newPassword !== values.confirmPassword) {
		resetForm.setError("confirmPassword", {
			message: "Passwords do not match",
		});
		return;
		}
		try {
		await axiosInstance.post(SELLER.RESET_PASSWORD, {
			email,
			otp: values.otp,
			newPassword: values.newPassword,
		});
		toast.success("Password reset — sign in with your new password.");
		navigate("/seller/login");
		} catch (err) {
		toast.error(err.friendlyMessage || "Failed to reset password.");
		}
	}

	if (step === "reset") {
		return (
		<div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-10">
			<h1 className="text-center font-display text-2xl font-semibold text-ink">
				Reset password
			</h1>

			<p className="mt-1 text-center text-sm text-ink-muted">
				Enter the OTP sent to {email}
			</p>

			<form
			onSubmit={resetForm.handleSubmit(submitReset)}
			className="mt-8 space-y-4"
			>
				<Input
					label="OTP"
					inputMode="numeric"
					error={resetForm.formState.errors.otp?.message}
					{...resetForm.register("otp", { required: "OTP is required" })}
				/>

				<Input
					label="New password"
					type="password"
					error={resetForm.formState.errors.newPassword?.message}
					{...resetForm.register("newPassword", {
					required: "New password is required",
					minLength: { value: 8, message: "At least 8 characters" },
					})}
				/>

				<Input
					label="Confirm new password"
					type="password"
					error={resetForm.formState.errors.confirmPassword?.message}
					{...resetForm.register("confirmPassword", {
					required: "Please confirm your password",
					})}
				/>

				<Button
					type="submit"
					variant="teal"
					fullWidth
					isLoading={resetForm.formState.isSubmitting}
				>
					Reset password
				</Button>

			</form>
		</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-10">
		<h1 className="text-center font-display text-2xl font-semibold text-ink">
			Forgot password
		</h1>

		<p className="mt-1 text-center text-sm text-ink-muted">
			We&apos;ll send a one-time code to your email
		</p>

		<form
			onSubmit={emailForm.handleSubmit(submitEmail)}
			className="mt-8 space-y-4"
		>
			<Input
			label="Email"
			type="email"
			error={emailForm.formState.errors.email?.message}
			{...emailForm.register("email", { required: "Email is required" })}
			/>

			<Button
			type="submit"
			variant="teal"
			fullWidth
			isLoading={emailForm.formState.isSubmitting}
			>
			Send OTP
			</Button>
		</form>

		<p className="mt-6 text-center text-sm text-ink-muted">
			Remembered it?{" "}
			<Link
				to="/seller/login"
				className="font-medium text-teal-600 hover:text-teal-700"
			>
				Sign in
			</Link>
		</p>
		</div>
	);
}
