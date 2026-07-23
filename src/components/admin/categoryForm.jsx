import { useForm } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";

export default function CategoryForm({ initialValues, categories, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || {
      name: "",
      description: "",
      parent_category_id: "",
      status: "ACTIVE",
    },
  });

  const otherCategories = categories.filter((c) => c.id !== initialValues?.id);

  function handleFormSubmit(values) {
    onSubmit({
      name: values.name,
      description: values.description || "",
      // The backend requires this key to always be present — null (no
      // parent) or a category id, never omitted.
      parent_category_id: values.parent_category_id ? Number(values.parent_category_id) : null,
      status: values.status,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Name"
        error={errors.name?.message}
        {...register("name", { required: "Name is required", maxLength: { value: 100, message: "Too long" } })}
      />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Description (optional)</span>
        <textarea
          rows={3}
          className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-300"
          {...register("description")}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Parent category (optional)</span>
        <select
          className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-300"
          {...register("parent_category_id")}
        >
          <option value="">No parent — top level</option>
          {otherCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Status</span>
        <select
          className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-300"
          {...register("status")}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="plum" isLoading={isSubmitting}>
          Save category
        </Button>
      </div>
    </form>
  );
}
