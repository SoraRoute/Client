import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Lock, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { CUSTOMER_CART, CUSTOMER_PRODUCTS, CUSTOMER_REVIEWS } from "../../api/endpoints";
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

// customerService.getCustomerProfile returns { success, customer }. The
// shared auth context strips only `success`/`message`, so depending on how
// the profile fetch resolved, the logged-in user's id can end up at either
// `user.id` or `user.customer.id` — read both defensively.
function currentUserId(user) {
  return user?.id ?? user?.customer?.id ?? null;
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
      const res = await axiosInstance.get(CUSTOMER_REVIEWS.BY_PRODUCT(productId));
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
      navigate("/login", { state: { from: { pathname: `/products/${productId}` } } });
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
        await axiosInstance.put(CUSTOMER_REVIEWS.BY_ID(editingReview.id), { rating, comment });
        toast.success("Review updated");
      } else {
        await axiosInstance.post(CUSTOMER_REVIEWS.BASE, { productId, rating, comment });
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
    if (!window.confirm("Delete this review?")) return;
    try {
      await axiosInstance.delete(CUSTOMER_REVIEWS.BY_ID(review.id));
      toast.success("Review deleted");
      loadReviews();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to delete review.");
    }
  }

  if (isLoading) return <Loader fullScreen label="Loading product…" />;
  if (error || !product) return <ErrorMessage message={error || "Product not found."} onRetry={loadProduct} />;

  const price = effectivePrice(product);
  const hasDiscount = Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price);
  const isWishlisted = wishlistedIds.has(product.id);
  const myUserId = currentUserId(user);
  const myReview = reviews.find((r) => r.user_id === myUserId);
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-2">
       <div className="aspect-square overflow-hidden rounded-3xl bg-white border border-paper-line">
  {product.image_url ? (
    <img
      src={product.image_url}
      alt={product.title}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gold-50 to-paper-line">
      <span className="font-display text-7xl font-semibold text-gold-600/70">
        {(product.title || "?").charAt(0).toUpperCase()}
      </span>
    </div>
  )}
</div>

        <div>
          {product.brand ? (
            <p className="text-xs uppercase tracking-wide text-ink-muted">{product.brand}</p>
          ) : null}
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{product.title}</h1>

          {reviews.length > 0 ? (
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={averageRating} />
              <span className="text-sm text-ink-muted">({reviews.length})</span>
            </div>
          ) : null}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl font-semibold text-ink">{formatPrice(price)}</span>
            {hasDiscount ? (
              <span className="text-base text-ink-muted line-through">{formatPrice(product.price)}</span>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.description}</p>
          ) : null}

          <div className="mt-6 flex items-center gap-3">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button icon={ShoppingCart} onClick={handleAddToCart} isLoading={isAddingToCart}>
              Add to cart
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={[
                "flex h-11 w-11 items-center justify-center rounded-xl border",
                isWishlisted
                  ? "border-plum-500 bg-plum-50 text-plum-500"
                  : "border-paper-line text-ink-muted hover:text-plum-500",
              ].join(" ")}
              aria-label="Toggle wishlist"
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Reviews</h2>
          {isAuthenticated && !myReview && !showReviewForm ? (
            <Button variant="outline" size="sm" onClick={() => setShowReviewForm(true)}>
              Write a review
            </Button>
          ) : null}
        </div>

        {!isAuthenticated ? (
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-paper-line bg-paper-raised/60 px-5 py-6 text-sm text-ink-muted">
            <Lock size={16} />
            <span>
              <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700">
                Sign in
              </Link>{" "}
              to read and write reviews.
            </span>
          </div>
        ) : (
          <div className="space-y-4">
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
              <p className="text-sm text-ink-muted">
                No reviews yet — only customers who&apos;ve purchased this product can review it.
              </p>
            ) : (
              <div className="rounded-2xl border border-paper-line bg-paper-raised px-5">
                {reviews.map((review) => (
                  <ReviewItem
                    key={review.id}
                    review={review}
                    isOwn={review.user_id === myUserId}
                    onEdit={(r) => {
                      setEditingReview(r);
                      setShowReviewForm(false);
                    }}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
