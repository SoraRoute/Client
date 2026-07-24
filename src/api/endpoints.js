// Shared Module
// Authors: Nishtha & Pinki

/**
 * All backend API endpoints are kept here.
 */

export const CUSTOMER = {
    // Customer authentication and profile
    REGISTER: "/api/customers/register",
    VERIFY_EMAIL: "/api/customers/verify-email",
    LOGIN: "/api/customers/login",
    FORGOT_PASSWORD: "/api/customers/forgot-password",
    RESET_PASSWORD: "/api/customers/reset-password",
    PROFILE: "/api/customers/profile",
    LOGOUT: "/api/customers/logout",
};

export const CUSTOMER_ADDRESSES = {
    // Customer address management
    BASE: "/api/customer-addresses",
    BY_ID: (id) => `/api/customer-addresses/${id}`,
};

export const CUSTOMER_WISHLIST = {
    // Wishlist operations
    BASE: "/api/customer-wishlist",
    ITEM: (productId) => `/api/customer-wishlist/${productId}`,
};

export const CUSTOMER_CART = {
    // Shopping cart operations
    BASE: "/api/customer-cart",
    ITEM: (productId) => `/api/customer-cart/${productId}`,
};

export const CUSTOMER_ORDERS = {
    // Customer order management
    BASE: "/api/customer-orders",
    BY_ID: (orderId) => `/api/customer-orders/${orderId}`,
    CANCEL: (orderId) => `/api/customer-orders/${orderId}/cancel`,
};

export const CUSTOMER_PAYMENTS = {
    // Payment related routes
    BASE: "/api/customer-payments",
    BY_ORDER: (orderId) => `/api/customer-payments/${orderId}`,
};

export const CUSTOMER_REVIEWS = {
    // Product review operations
    BASE: "/api/customer-reviews",
    BY_PRODUCT: (productId) => `/api/customer-reviews/${productId}`,
    BY_ID: (reviewId) => `/api/customer-reviews/${reviewId}`,
};

export const CUSTOMER_PRODUCTS = {
    // Product browsing and searching
    BASE: "/api/customer-products",
    SEARCH: "/api/customer-products/search",
    BY_CATEGORY: (categoryId) => `/api/customer-products/category/${categoryId}`,
    BY_ID: (productId) => `/api/customer-products/${productId}`,
};

// Public home page data
export const CUSTOMER_HOME = "/api/customer-home";

export const CATEGORIES = {
    // Category management
    CUSTOMER_LIST: "/api/categories/customer",
    ADMIN_LIST: "/api/categories/admin",
    BY_ID: (id) => `/api/categories/${id}`,
    STATUS: (id) => `/api/categories/${id}/status`,
    CREATE: "/api/categories",
};

export const AI = {
    // AI chatbot endpoint
    CHAT: "/api/ai/chat",
};

export const SELLER = {
    // Seller authentication and account management
    SEND_OTP: "/api/seller/send-otp",
    VERIFY_OTP: "/api/seller/verify-otp",
    REGISTER: "/api/seller/register",
    LOGIN: "/api/seller/login",
    PROFILE: "/api/seller/profile",
    UPDATE_PROFILE: "/api/seller/update-profile",
    FORGOT_PASSWORD: "/api/seller/forgot-password",
    RESET_PASSWORD: "/api/seller/reset-password",
    CHANGE_PASSWORD: "/api/seller/change-password",
    LOGOUT: "/api/seller/logout",
    ORDERS: "/api/seller/orders",
    REVENUE: "/api/seller/revenue",
    ORDER_STATUS: (orderId) => `/api/seller/orders/${orderId}/status`,
};

export const SELLER_DASHBOARD = {
    // Seller dashboard data
    SUMMARY: "/api/seller/dashboard",
    PRODUCT_STATISTICS: "/api/seller/dashboard/product-statistics",
    RECENT_PRODUCTS: "/api/seller/dashboard/recent-products",
    CATEGORY_WISE_COUNT: "/api/seller/dashboard/category-wise-product-count",
};

export const PRODUCTS = {
    // Seller product management
    ADD: "/api/products/add",
    MY_PRODUCTS: "/api/products/my-products",
    BY_ID: (id) => `/api/products/${id}`,
    STATUS: (id) => `/api/products/${id}/status`,
};

export const ADMIN = {
    // Admin authentication and profile
    LOGIN: "/api/admin/login",
    SEND_OTP: "/api/admin/send-otp",
    VERIFY_OTP: "/api/admin/verify-otp",
    RESET_PASSWORD: "/api/admin/reset-password",
    PROFILE: "/api/admin/profile",
    CHANGE_PASSWORD: "/api/admin/change-password",
    LOGOUT: "/api/admin/logout",
};

export const ADMIN_SELLERS = {
    // Admin seller management
    BASE: "/api/admin/sellers",
    BY_ID: (id) => `/api/admin/sellers/${id}`,
    STATUS: (id) => `/api/admin/sellers/${id}/status`,
};

export const ADMIN_PRODUCTS = {
    // Admin product management
    BASE: "/api/admin/products",
    BY_ID: (productId) => `/api/admin/products/${productId}`,
    STATUS: (productId) => `/api/admin/products/${productId}/status`,
};

// Admin dashboard
export const ADMIN_DASHBOARD = "/api/admin/dashboard";

export const ADMIN_ORDERS = {
    // Admin order management
    BASE: "/api/admin/orders",
    BY_ID: (orderId) => `/api/admin/orders/${orderId}`,
    STATUS: (orderId) => `/api/admin/orders/${orderId}/status`,
};
