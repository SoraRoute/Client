/**
 * Single source of truth for every backend route.
 *
 * These paths are copied verbatim from the backend's Routes/*.js files and
 * app.js mount points. DO NOT change any path here without also changing
 * the backend — the frontend must work exactly with the existing backend.
 */

export const CUSTOMER = {
  REGISTER: "/api/customers/register",
  VERIFY_EMAIL: "/api/customers/verify-email",
  LOGIN: "/api/customers/login",
  FORGOT_PASSWORD: "/api/customers/forgot-password",
  RESET_PASSWORD: "/api/customers/reset-password",
  PROFILE: "/api/customers/profile", // GET, PATCH
  LOGOUT: "/api/customers/logout",
};

export const CUSTOMER_ADDRESSES = {
  BASE: "/api/customer-addresses", // POST, GET
  BY_ID: (id) => `/api/customer-addresses/${id}`, // GET, PATCH, DELETE
};

export const CUSTOMER_WISHLIST = {
  BASE: "/api/customer-wishlist", // GET
  ITEM: (productId) => `/api/customer-wishlist/${productId}`, // POST, DELETE
};

export const CUSTOMER_CART = {
  BASE: "/api/customer-cart", // GET
  ITEM: (productId) => `/api/customer-cart/${productId}`, // POST, PATCH, DELETE
};

export const CUSTOMER_ORDERS = {
  BASE: "/api/customer-orders", // POST (place order), GET (list)
  BY_ID: (orderId) => `/api/customer-orders/${orderId}`, // GET
  CANCEL: (orderId) => `/api/customer-orders/${orderId}/cancel`, // DELETE
};

export const CUSTOMER_PAYMENTS = {
  BASE: "/api/customer-payments", // POST
  BY_ORDER: (orderId) => `/api/customer-payments/${orderId}`, // GET
};

export const CUSTOMER_REVIEWS = {
  BASE: "/api/customer-reviews", // POST
  BY_PRODUCT: (productId) => `/api/customer-reviews/${productId}`, // GET
  BY_ID: (reviewId) => `/api/customer-reviews/${reviewId}`, // PUT, DELETE
};

export const CUSTOMER_PRODUCTS = {
  BASE: "/api/customer-products", // GET (all)
  SEARCH: "/api/customer-products/search", // GET ?keyword=
  BY_CATEGORY: (categoryId) => `/api/customer-products/category/${categoryId}`, // GET
  BY_ID: (productId) => `/api/customer-products/${productId}`, // GET
};

export const CUSTOMER_HOME = "/api/customer-home"; // GET (public)

export const CATEGORIES = {
  CUSTOMER_LIST: "/api/categories/customer", // GET (public)
  ADMIN_LIST: "/api/categories/admin", // GET (admin)
  BY_ID: (id) => `/api/categories/${id}`, // GET, PUT, DELETE
  STATUS: (id) => `/api/categories/${id}/status`, // PATCH
  CREATE: "/api/categories", // POST (admin)
};

export const AI = {
  CHAT: "/api/ai/chat", // POST
};

export const SELLER = {
  SEND_OTP: "/api/seller/send-otp",
  VERIFY_OTP: "/api/seller/verify-otp",
  REGISTER: "/api/seller/register", // requires Authorization: Bearer <verificationToken>
  LOGIN: "/api/seller/login",
  PROFILE: "/api/seller/profile", // GET
  UPDATE_PROFILE: "/api/seller/update-profile", // PATCH
  FORGOT_PASSWORD: "/api/seller/forgot-password",
  RESET_PASSWORD: "/api/seller/reset-password",
  CHANGE_PASSWORD: "/api/seller/change-password", // PATCH
  LOGOUT: "/api/seller/logout",
  ORDERS: "/api/seller/orders", // GET
  REVENUE: "/api/seller/revenue", // GET
  ORDER_STATUS: (orderId) => `/api/seller/orders/${orderId}/status`, // PATCH
};

export const SELLER_DASHBOARD = {
  SUMMARY: "/api/seller/dashboard",
  PRODUCT_STATISTICS: "/api/seller/dashboard/product-statistics",
  RECENT_PRODUCTS: "/api/seller/dashboard/recent-products",
  CATEGORY_WISE_COUNT: "/api/seller/dashboard/category-wise-product-count",
};

export const PRODUCTS = {
  ADD: "/api/products/add", // POST multipart (field name: images, max 5)
  MY_PRODUCTS: "/api/products/my-products", // GET
  BY_ID: (id) => `/api/products/${id}`, // GET, PUT, DELETE
  STATUS: (id) => `/api/products/${id}/status`, // PATCH
};

export const ADMIN = {
  LOGIN: "/api/admin/login",
  SEND_OTP: "/api/admin/send-otp",
  VERIFY_OTP: "/api/admin/verify-otp",
  RESET_PASSWORD: "/api/admin/reset-password",
  PROFILE: "/api/admin/profile", // GET
  CHANGE_PASSWORD: "/api/admin/change-password", // PUT
  LOGOUT: "/api/admin/logout",
};

export const ADMIN_SELLERS = {
  BASE: "/api/admin/sellers", // GET
  BY_ID: (id) => `/api/admin/sellers/${id}`, // GET
  STATUS: (id) => `/api/admin/sellers/${id}/status`, // PATCH
};

export const ADMIN_PRODUCTS = {
  BASE: "/api/admin/products", // GET
  BY_ID: (productId) => `/api/admin/products/${productId}`, // GET, DELETE
  STATUS: (productId) => `/api/admin/products/${productId}/status`, // PATCH
};

export const ADMIN_DASHBOARD = "/api/admin/dashboard"; // GET

export const ADMIN_ORDERS = {
  BASE: "/api/admin/orders", // GET
  BY_ID: (orderId) => `/api/admin/orders/${orderId}`, // GET
  STATUS: (orderId) => `/api/admin/orders/${orderId}/status`, // PATCH
};
