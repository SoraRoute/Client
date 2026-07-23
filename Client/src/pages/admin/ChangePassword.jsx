import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN } from "../../api/endpoints";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ChangePassword() {
  useDocumentTitle("Change password");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    if (values.newPassword !== values.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    try {
      await axiosInstance.put(ADMIN.CHANGE_PASSWORD, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed");
      navigate("/admin/profile");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to change password.");
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <Link to="/admin/profile" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ChevronLeft size={14} /> Your profile
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink">Change password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current password"
          type="password"
          error={errors.oldPassword?.message}
          {...register("oldPassword", { required: "Current password is required" })}
        />
        <Input
          label="New password"
          type="password"
          hint="At least 8 characters"
          error={errors.newPassword?.message}
          {...register("newPassword", {
            required: "New password is required",
            minLength: { value: 8, message: "At least 8 characters" },
          })}
        />
        <Input
          label="Confirm new password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", { required: "Please confirm your new password" })}
        />

        <Button type="submit" variant="plum" fullWidth isLoading={isSubmitting}>
          Change password
        </Button>
      </form>
    </div>
  );
}
