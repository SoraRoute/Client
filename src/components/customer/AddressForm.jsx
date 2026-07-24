// Customer Frontend
// Author: Nishtha

import { useForm } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";

const ADDRESS_TYPES = ["home", "work", "other"];

export default function AddressForm({ initialValues, onSubmit, onCancel, isSubmitting }) {

    // Reuse the same form for both adding and editing addresses.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues || {
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            address_type: "home",
            is_default: false,
        },
    });

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Address details */}
            <Input
                label="Address line 1"
                placeholder="House no., street"
                error={errors.address_line1?.message}
                {...register("address_line1", { required: "Address line 1 is required" })}
            />

            <Input
                label="Address line 2 (optional)"
                placeholder="Landmark, apartment"
                {...register("address_line2")}
            />

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="City"
                    error={errors.city?.message}
                    {...register("city", { required: "City is required" })}
                />
                <Input
                    label="State"
                    error={errors.state?.message}
                    {...register("state", { required: "State is required" })}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Pincode"
                    error={errors.pincode?.message}
                    {...register("pincode", {
                        required: "Pincode is required",
                        pattern: { value: /^[0-9]{4,10}$/, message: "Enter a valid pincode" },
                    })}
                />

                <Input label="Country" {...register("country")} />
            </div>

            {/* Address preferences */}
            <label className="block">

                <span className="mb-1.5 block text-sm font-medium text-ink-soft">Address type</span>

                <select
                    {...register("address_type")}
                    className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300"
                >
                    {ADDRESS_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type[0].toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>

            </label>

            <label className="flex items-center gap-2 text-sm text-ink-soft">

                <input type="checkbox" className="h-4 w-4 rounded border-paper-line" {...register("is_default")} />
                Set as default address

            </label>

            {/* Form actions */}
            <div className="flex justify-end gap-2 pt-2">

                {onCancel ? (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                ) : null}

                <Button type="submit" isLoading={isSubmitting}>
                    Save address
                </Button>

            </div>

        </form>
    );
}