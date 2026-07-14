const express = require("express");

const sellerRoutes = require("./Routes/sellerRoutes");
const productRoutes = require("./Routes/productRoutes");
const customerRoutes=require("./Routes/customerRoutes");
const customerAddressRoutes=require("./Routes/customerAddressRoutes");

const app = express();
app.use(express.json());


app.use("/api/seller",sellerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customer-addresses", customerAddressRoutes);
app.use("/api/products",productRoutes);

app.use("/uploads", express.static("uploads"));

module.exports = app;
