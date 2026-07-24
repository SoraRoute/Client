// Customer Frontend
// Author: Nishtha

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Lock,
  ShoppingCart,
  ShieldCheck,
  MessageSquareText,
  Star,
  PenLine,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import {
  CUSTOMER_CART,
  CUSTOMER_PRODUCTS,
  CUSTOMER_REVIEWS,
} from "../../api/endpoints";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useWishlist from "../../hooks/useWishlist";
import { effectivePrice, formatPrice } from "../../utils/format";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import QuantityStepper from "../../components/customer/QuantityStepper";
import StarRating from "../../components/customer/StarRating";
import ReviewItem from "../../components/customer/ReviewItem";
import ReviewForm from "../../components/customer/ReviewForm";
import ProductImageGallery from "../../components/customer/ProductImageGallery";
// customerService.getCustomerProfile returns { success, customer }. The
// shared auth context strips only `success`/`message`, so depending on how
// the profile fetch resolved, the logged-in user's id can end up at either
// `user.id` or `user.customer.id` — read both defensively.
function currentUserId(user) {
  return user?.id ?? user?.customer?.id ?? null;
}

// Stock can be represented under a few different field names depending on
// how the product was seeded/created — read defensively rather than assume
// a single shape. `undefined`/`null` is treated as "unknown" and rendered
// as in-stock so we never falsely block a purchasable product.
function stockCount(product) {
  const raw = product?.stock ?? product?.stock_quantity ?? product?.quantity;
  if (raw === undefined || raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

// Builds a 5→1 star breakdown (count + percentage) for the ratings summary
// bars. Purely a display helper for the Reviews section.
function ratingBreakdown(reviews) {
  const counts = [0, 0, 0, 0, 0, 0]; // index by star value 1-5
  reviews.forEach((r) => {
    const n = Math.round(Number(r.rating));
    if (n >= 1 && n <= 5) counts[n] += 1;
  });
  const total = reviews.length;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percent: total ? Math.round((counts[star] / total) * 100) : 0,
  }));
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useCustomerAuth();
  const { wishlistedIds, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useDocumentTitle(product?.title || "Product");

  async function loadProduct() {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(CUSTOMER_PRODUCTS.BY_ID(productId));
      setProduct(res.data.product);
    } catch (err) {
      setError(err.friendlyMessage || "Product not found.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadReviews() {
    if (!isAuthenticated) return;
    setReviewsError("");
    try {
      const res = await axiosInstance.get(
        CUSTOMER_REVIEWS.BY_PRODUCT(productId),
      );
      setReviews(res.data.reviews || []);
    } catch (err) {
      setReviewsError(err.friendlyMessage || "Failed to load reviews.");
    }
  }

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isAuthenticated]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: `/products/${productId}` } },
      });
      return;
    }
    setIsAddingToCart(true);
    try {
      await axiosInstance.post(CUSTOMER_CART.ITEM(productId), { quantity });
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to add to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleReviewSubmit({ rating, comment }) {
    setIsSubmittingReview(true);
    try {
      if (editingReview) {
        await axiosInstance.put(CUSTOMER_REVIEWS.BY_ID(editingReview.id), {
          rating,
          comment,
        });
        toast.success("Review updated");
      } else {
        await axiosInstance.post(CUSTOMER_REVIEWS.BASE, {
          productId,
          rating,
          comment,
        });
        toast.success("Review submitted");
      }
      setShowReviewForm(false);
      setEditingReview(null);
      loadReviews();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to save review.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  async function handleDeleteReview(review) {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
      focusCancel: true,
      buttonsStyling: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5 py-2.5 font-medium",
        cancelButton: "rounded-xl px-5 py-2.5 font-medium",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(CUSTOMER_REVIEWS.BY_ID(review.id));

      toast.success("Review deleted");

      loadReviews();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to delete review.");
    }
  }

  if (isLoading) return <Loader fullScreen label="Loading product…" />;
  if (error || !product)
    return (
      <ErrorMessage
        message={error || "Product not found."}
        onRetry={loadProduct}
      />
    );

  const price = effectivePrice(product);
  const hasDiscount =
    Number(product.discount_price) > 0 &&
    Number(product.discount_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.discount_price)) /
          Number(product.price)) *
          100,
      )
    : 0;
  const savedAmount = hasDiscount
    ? Number(product.price) - Number(product.discount_price)
    : 0;

  const isWishlisted = wishlistedIds.has(product.id);
  const myUserId = currentUserId(user);
  const myReview = reviews.find((r) => r.user_id === myUserId);
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;
  const breakdown = ratingBreakdown(reviews);

  const stock = stockCount(product);
  const isOutOfStock = stock !== null && stock <= 0;
  const isLowStock = stock !== null && stock > 0 && stock <= 5;

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
        {/* Product image gallery */}
        <ProductImageGallery product={product} />

        {/* Details */}
        <div className="flex flex-col">
          {product.brand ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {product.brand}
            </p>
          ) : null}

          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {product.title}
          </h1>

          {reviews.length > 0 ? (
            <div className="mt-3 flex items-center gap-2.5">
              <StarRating value={averageRating} />
              <span className="text-sm font-semibold text-ink">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-ink-muted">
                · {reviews.length} Review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>
          ) : null}

          {/* Pricing */}
          <div className="mt-6 rounded-2xl border border-paper-line bg-paper-raised/60 p-5">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="font-display text-3xl font-bold text-ink sm:text-4xl">
                {formatPrice(price)}
              </span>
              {hasDiscount ? (
                <>
                  <span className="text-lg text-ink-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {discountPercent}% OFF
                  </span>
                </>
              ) : null}
            </div>
            {hasDiscount ? (
              <p className="mt-2 text-sm font-medium text-emerald-600">
                You save {formatPrice(savedAmount)}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-ink-muted">
              Inclusive of all taxes
            </p>
          </div>

          {/* Stock badge */}
          <div className="mt-4">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                Only {stock} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck size={13} strokeWidth={2.5} />
                In Stock
              </span>
            )}
          </div>

          {product.description ? (
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>
          ) : null}

          {/* Add to cart */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                aria-pressed={isWishlisted}
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 focus-visible:ring-offset-2",
                  isWishlisted
                    ? "border-plum-500 bg-plum-50 text-plum-500 hover:bg-plum-100"
                    : "border-paper-line text-ink-muted hover:border-plum-300 hover:text-plum-500",
                ].join(" ")}
              >
                <Heart
                  size={19}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            <Button
              icon={ShoppingCart}
              onClick={handleAddToCart}
              isLoading={isAddingToCart}
              disabled={isOutOfStock}
              className="w-full justify-center sm:w-auto sm:flex-1"
              aria-label="Add to cart"
            >
              {isOutOfStock ? "Out of Stock" : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Ratings &amp; Reviews
          </h2>
          {isAuthenticated && !myReview && !showReviewForm ? (
            <Button
              variant="outline"
              size="sm"
              icon={PenLine}
              onClick={() => setShowReviewForm(true)}
            >
              Write a review
            </Button>
          ) : null}
        </div>

        {!isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-paper-line bg-paper-raised/60 px-5 py-6 text-sm text-ink-muted">
            <Lock size={16} className="shrink-0" />
            <span>
              <Link
                to="/login"
                className="font-medium text-teal-600 underline-offset-2 hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 rounded"
              >
                Sign in
              </Link>{" "}
              to read and write reviews.
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rating summary */}
            {reviews.length > 0 ? (
              <div className="grid gap-6 rounded-3xl border border-paper-line bg-white p-6 shadow-sm sm:p-7 md:grid-cols-[auto_1fr] md:gap-10">
                <div className="flex flex-row items-center gap-6 md:flex-col md:items-start md:gap-2 md:border-r md:border-paper-line md:pr-10">
                  <span className="font-display text-5xl font-bold leading-none text-ink">
                    {averageRating.toFixed(1)}
                  </span>
                  <div>
                    <StarRating value={averageRating} />
                    <p className="mt-1.5 text-sm text-ink-muted">
                      {reviews.length} Review{reviews.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  {breakdown.map(({ star, count, percent }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="flex w-10 shrink-0 items-center gap-1 text-xs font-semibold text-ink-soft">
                        {star}{" "}
                        <Star
                          size={11}
                          className="fill-gold-500 text-gold-500"
                        />
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-raised">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs text-ink-muted">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {showReviewForm || editingReview ? (
              <ReviewForm
                initialValues={editingReview}
                isSubmitting={isSubmittingReview}
                onSubmit={handleReviewSubmit}
                onCancel={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                }}
              />
            ) : null}

            {reviewsError ? (
              <ErrorMessage message={reviewsError} onRetry={loadReviews} />
            ) : reviews.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-gold-300/70 bg-gradient-to-b from-gold-50/70 to-paper-raised/40 px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gold-200">
                  <MessageSquareText
                    size={24}
                    className="text-gold-600"
                    strokeWidth={1.75}
                  />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-ink">
                  No reviews yet
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-muted">
                  Only customers who&apos;ve purchased this product can leave a
                  review. Be the first to share what you thought.
                </p>
                {!showReviewForm ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={PenLine}
                    onClick={() => setShowReviewForm(true)}
                    className="mt-5"
                  >
                    Write the first review
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="divide-y divide-paper-line overflow-hidden rounded-3xl border border-paper-line bg-white shadow-sm">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="transition-colors duration-150 hover:bg-paper-raised/40"
                  >
                    <ReviewItem
                      review={review}
                      isOwn={review.user_id === myUserId}
                      onEdit={(r) => {
                        setEditingReview(r);
                        setShowReviewForm(false);
                      }}
                      onDelete={handleDeleteReview}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
