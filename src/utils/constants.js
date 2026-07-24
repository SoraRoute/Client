// Backend API URL.
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Base path for locally stored uploaded images.
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads`;

// Available order statuses.
export const ORDER_STATUSES = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

// Available product statuses.
export const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE"];

// Available category statuses.
export const CATEGORY_STATUSES = ["ACTIVE", "INACTIVE"];

// Available seller account statuses.
export const SELLER_ACCOUNT_STATUSES = ["PENDING", "ACTIVE", "SUSPENDED"];

// Supported payment methods.
export const PAYMENT_METHODS = ["COD", "UPI", "CARD", "NETBANKING"];
