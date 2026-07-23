import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN } from "../../api/endpoints";
import { useAdminAuth } from "../../context/AdminAuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
  useDocumentTitle("Admin sign in");
  const navigate = useNavigate();
  const { refresh } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    try {
      await axiosInstance.post(ADMIN.LOGIN, values);
      await refresh();
      toast.success("Welcome back!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.friendlyMessage || "Login failed.");
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="text-center font-display text-2xl font-semibold text-ink">Admin Console</h1>
      <p className="mt-1 text-center text-sm text-ink-muted">Sign in to manage MarketHive</p>

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

        <Button type="submit" variant="plum" fullWidth isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
