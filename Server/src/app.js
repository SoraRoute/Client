const express = require("express");
const app = express();
app.use(express.json());
const sellerRoutes = require("./Routes/sellerRoutes");

const productRoutes = require("./Routes/productRoutes");

const customerRoutes=require("./Routes/customerRoutes");

const customerAddressRoutes=require("./Routes/customerAddressRoutes");

const customerWishlistRoutes=require("./Routes/customerWishlistRoutes");

const customerCartRoutes = require("./Routes/customerCartRoutes");

const categoryRoutes = require("./Routes/categoryRoutes");




app.use("/api/seller",sellerRoutes);
app.use("/api/products",productRoutes);
app.use("/api/my-products",productRoutes);


app.use("/api/customers", customerRoutes);
app.use("/api/customer-addresses", customerAddressRoutes);
app.use("/api/customer-wishlist", customerWishlistRoutes);
app.use("/api/customer-cart", customerCartRoutes);



app.use("/uploads", express.static("uploads"));

app.use("/api/categories",categoryRoutes);


module.exports = app;
