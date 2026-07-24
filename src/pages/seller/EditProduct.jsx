import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosInstance";
import { PRODUCTS } from "../../api/endpoints";

import useCategories from "../../hooks/useCategories";
import useDocumentTitle from "../../hooks/useDocumentTitle";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function EditProduct() {
    const { productId } = useParams();
    const navigate = useNavigate();

    useDocumentTitle("Edit product");

    const { categories, isLoading: categoriesLoading } = useCategories();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    async function load() {
        setIsLoading(true);
        setError("");

        try {
            const res = await axiosInstance.get(PRODUCTS.BY_ID(productId));
            const data = res.data.data;

            setProduct(data);

            reset({
                category_id: data.category_id,
                title: data.title,
                description: data.description || "",
                brand: data.brand || "",
                price: data.price,
                discount_price: data.discount_price || "",
                stock: data.stock,
                status: data.status,
            });

        } catch (err) {
            setError(err.friendlyMessage || "Failed to load this product.");

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [productId]);

    async function onSubmit(values) {
        try {
            await axiosInstance.put(PRODUCTS.BY_ID(productId), {
                category_id: values.category_id,
                title: values.title,
                description: values.description || "",
                brand: values.brand || "",
                price: values.price,
                discount_price: values.discount_price || "0",
                stock: values.stock,
                status: values.status,
            });

            toast.success("Product updated");
            navigate("/seller/products");

        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update product.");
        }
    }

    if (isLoading) {
        return <Loader fullScreen label="Loading product…" />;
    }

    if (error || !product) {
        return (
            <ErrorMessage message={error || "Product not found."} onRetry={load} />
        );
    }

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <Link
                to="/seller/products"
                className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
            >
                <ChevronLeft size={14} />
                Your products
            </Link>

            <h1 className="font-display text-2xl font-semibold text-ink">
                Edit product
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
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
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    )}
                </label>

                {/* Price, Discount & Stock */}
                <div className="grid grid-cols-3 gap-3">
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
                                message: "Must be > 0",
                            },
                        })}
                    />

                    <Input
                        label="Discount price"
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("discount_price")}
                    />

                    <Input
                        label="Stock"
                        type="number"
                        step="1"
                        min="0"
                        error={errors.stock?.message}
                        {...register("stock", {
                            required: "Stock is required",
                            min: {
                                value: 0,
                                message: "Can't be negative",
                            },
                        })}
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

                {/* Submit */}
                <Button type="submit" variant="teal" fullWidth isLoading={isSubmitting}>
                    Save changes
                </Button>
            </form>
        </div>
    );
}
