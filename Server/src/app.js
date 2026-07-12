const express = require("express");
const sellerRoutes = require("./Routes/sellerRoutes");

const app = express();
app.use(express.json());
const customerRoutes=require("./Routes/customerRoutes");

app.use("/api/seller",sellerRoutes);
app.use("/api/customers", customerRoutes);

module.exports = app;
