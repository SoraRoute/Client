const express = require("express");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const sellerRoutes = require("./Routes/sellerRoutes");

const sellerDashboardRoutes = require("./Routes/sellerDashboardRoutes");

const productRoutes = require("./Routes/productRoutes");

const customerRoutes = require("./Routes/customerRoutes");

const customerAddressRoutes = require("./Routes/customerAddressRoutes");

const customerWishlistRoutes = require("./Routes/customerWishlistRoutes");

const customerCartRoutes = require("./Routes/customerCartRoutes");

const categoryRoutes = require("./Routes/categoryRoutes");
const customerOrderRoutes = require("./Routes/customerOrderRoutes");
const customerPaymentRoutes = require("./Routes/customerPaymentRoutes");
const customerReviewRoutes = require("./Routes/customerReviewRoutes");
const customerProductRoutes = require("./Routes/customerProductRoutes");
const customerHomeRoutes = require("./Routes/customerHomeRoutes");
const aiRoutes = require("./Routes/aiRoutes");

const adminRoutes = require("./Routes/adminRoutes");
const adminSellerRoutes= require("./Routes/adminSellerRoutes");
const adminProductRoutes = require("./Routes/adminProductRoutes");
const adminDashboardRoutes = require("./Routes/adminDashboardRoutes");
const adminOrderRoutes = require("./Routes/adminOrderRoutes");


app.use("/api/seller", sellerRoutes);
app.use("/api/seller/dashboard",sellerDashboardRoutes);

app.use("/api/products", productRoutes);
app.use("/api/my-products", productRoutes);

app.use("/api/customers", customerRoutes);
app.use("/api/customer-addresses", customerAddressRoutes);
app.use("/api/customer-wishlist", customerWishlistRoutes);
app.use("/api/customer-cart", customerCartRoutes);
app.use("/api/customer-orders", customerOrderRoutes);
app.use("/api/customer-payments", customerPaymentRoutes);
app.use("/api/customer-reviews", customerReviewRoutes);
app.use("/api/customer-products", customerProductRoutes);
app.use("/api/customer-home", customerHomeRoutes);
app.use("/api/ai", aiRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/categories", categoryRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/sellers",adminSellerRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin/dashboard",adminDashboardRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

module.exports = app;
