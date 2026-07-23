// Base URL for the MarketHive backend. Configure in .env as VITE_API_BASE_URL.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Where product images uploaded via multer/cloudinary resolve to when the
// backend ever returns a relative /uploads path instead of a full Cloudinary URL.
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads`;

// Order status values exactly as defined in the `orders.order_status` ENUM.
export const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// Product status values exactly as defined in the `products.status` ENUM.
export const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE"];

// Category status values exactly as defined in the `categories.status` ENUM.
export const CATEGORY_STATUSES = ["ACTIVE", "INACTIVE"];

// Seller account status values exactly as defined in `sellers.account_status`.
export const SELLER_ACCOUNT_STATUSES = ["PENDING", "ACTIVE", "SUSPENDED"];

// Payment methods exactly as defined in `payments.payment_method`.
export const PAYMENT_METHODS = ["COD", "UPI", "CARD", "NETBANKING"];
