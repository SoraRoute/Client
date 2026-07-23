import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER } from "../../api/endpoints";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

export default function Profile() {
  useDocumentTitle("Your profile");
  const navigate = useNavigate();
  const { user, isLoading, clear } = useCustomerAuth();
  const customer = user?.customer;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm();

  useEffect(() => {
    if (customer) {
      reset({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        mobile: customer.mobile || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  async function onSubmit(values) {
    try {
      await axiosInstance.patch(CUSTOMER.PROFILE, values);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update profile.");
    }
  }

  async function handleLogout() {
    try {
      await axiosInstance.post(CUSTOMER.LOGOUT);
    } catch {
      // Even if the server call fails, clear local auth state below.
    } finally {
      clear();
      navigate("/");
    }
  }

  if (isLoading || !customer) return <Loader fullScreen label="Loading your profile…" />;

  return (
    <div className="mx-auto max-w-md space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Your profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            error={errors.first_name?.message}
            {...register("first_name", { required: "Required" })}
          />
          <Input
            label="Last name"
            error={errors.last_name?.message}
            {...register("last_name", { required: "Required" })}
          />
        </div>
        <Input label="Email" value={customer.email || ""} disabled />
        <Input
          label="Mobile"
          type="tel"
          error={errors.mobile?.message}
          {...register("mobile", { required: "Mobile number is required" })}
        />
        <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
      </form>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm font-medium text-danger-500 hover:text-danger-600"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
