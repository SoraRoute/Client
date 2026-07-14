const express = require("express");
const sellerRoutes = require("./Routes/sellerRoutes");

const app = express();
app.use(express.json());
const customerRoutes=require("./Routes/customerRoutes");
const customerAddressRoutes=require("./Routes/customerAddressRoutes");
const customerWishlistRoutes=require("./Routes/customerWishlistRoutes");

app.use("/api/seller",sellerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customer-addresses", customerAddressRoutes);
app.use("/api/customer-wishlist", customerWishlistRoutes);

module.exports = app;
