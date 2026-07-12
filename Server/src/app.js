const express = require("express");
const sellerRoutes = require("./routes/sellerRoutes");

const app = express();
app.use(express.json());
const customerRoutes=require("./Routes/customerRoutes");

app.use("/api/sellers",sellerRoutes);
app.use("/api/customers", customerRoutes);

module.exports = app;
