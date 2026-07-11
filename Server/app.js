const express = require("express");
const sellerRoutes = require("./routes/sellerRoutes");

const app = express();
app.use(express.json());

app.use("/api/sellers",sellerRoutes);

module.exports = app;
