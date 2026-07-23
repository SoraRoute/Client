import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosInstance";
import { PRODUCTS } from "../../api/endpoints";

import useCategories from "../../hooks/useCategories";
import useDocumentTitle from "../../hooks/useDocumentTitle";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ImagePicker from "../../components/seller/ImagePicker";

export default function AddProduct() {
    useDocumentTitle("Add product");

    const navigate = useNavigate();
    const { categories, isLoading: categoriesLoading } = useCategories();

    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            status: "ACTIVE",
            discount_price: "",
        },
    });

    async function onSubmit(values) {
        if (images.length === 0) {
            setImageError("At least one product image is required.");
            return;
        }

        setImageError("");

        const formData = new FormData();

        formData.append("category_id", values.category_id);
        formData.append("title", values.title);
        formData.append("description", values.description || "");
        formData.append("brand", values.brand || "");
        formData.append("price", values.price);

        // Send 0 if discount price is left empty
        formData.append("discount_price", values.discount_price || "0");

        formData.append("status", values.status);

        images.forEach((file) => {
            formData.append("images", file);
        });

        try {
            await axiosInstance.post(PRODUCTS.ADD, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Product added");
            navigate("/seller/products");
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to add product.");
        }
    }

    return (
        <div className="mx-auto max-w-m space-y-6">
            <Link
                to="/seller/products"
                className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
            >
                <ChevronLeft size={14} />
                Your Products
            </Link>

            <h1 className="text-center font-display text-2xl font-semibold text-ink">
                Add Product
            </h1>

            <div className="rounded-2xl border border-paper-line bg-paper-raised p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Product Title */}
                    <Input
                        label="Title"
                        error={errors.title?.message}
                        {...register("title", {
                            required: "Title is required",
                            maxLength: {
                                value: 255,
                                message: "Too long",
                            },
                        })}
                    />

                    {/* Category */}
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                            Category
                        </span>

                        {categoriesLoading ? (
                            <Loader size={20} label="" />
                        ) : (
                            <select
                                className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
                                {...register("category_id", {
                                    required: "Category is required",
                                })}
                            >
                                <option value="">Select a category</option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {errors.category_id && (
                            <span className="mt-1 block text-xs text-danger-500">
                                {errors.category_id.message}
                            </span>
                        )}
                    </label>

                    {/* Price & Discount Price */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            error={errors.price?.message}
                            {...register("price", {
                                required: "Price is required",
                                min: {
                                    value: 0.01,
                                    message: "Must be greater than 0",
                                },
                            })}
                        />

                        <Input
                            label="Discount price (optional)"
                            type="number"
                            step="0.01"
                            min="0"
                            hint="Leave blank if not discounted"
                            {...register("discount_price")}
                        />
                    </div>

                    {/* Brand */}
                    <Input
                        label="Brand (optional)"
                        {...register("brand", {
                            maxLength: {
                                value: 100,
                                message: "Too long",
                            },
                        })}
                    />

                    {/* Description */}
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                            Description (optional)
                        </span>

                        <textarea
                            rows={4}
                            className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
                            {...register("description")}
                        />
                    </label>

                    {/* Status */}
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                            Status
                        </span>

                        <select
                            className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
                            {...register("status")}
                        >
                            <option value="ACTIVE">Active — visible to customers</option>

                            <option value="INACTIVE">Inactive — hidden from customers</option>
                        </select>
                    </label>

                    {/* Product Images */}
                    <ImagePicker files={images} onChange={setImages} error={imageError} />

                    {/* Submit Button */}
                    <Button type="submit" variant="teal" fullWidth isLoading={isSubmitting}>
                        Add product
                    </Button>
                </form>
            </div>
        </div>
    );
}
