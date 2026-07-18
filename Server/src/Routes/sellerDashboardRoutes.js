const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const sellerDashboardController = require("../controllers/sellerDashboardController");

router.get("/",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getDashboardSummary
)

router.get("/product-statistics",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getProductStatistics
)

router.get("/recent-products",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getRecentProducts
)

router.get("/category-wise-product-count",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getCategoryWiseProductCount
)

module.exports = router;