const express = require("express");

const adminOrderController = require("../controllers/adminOrderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Get All Orders
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    adminOrderController.getAllOrders
);

// Get Order By ID
router.get(
    "/:orderId",
    authMiddleware,
    roleMiddleware("admin"),
    adminOrderController.getOrderById
);

// Update Order Status
router.patch(
    "/:orderId/status",
    authMiddleware,
    roleMiddleware("admin"),
    adminOrderController.updateOrderStatus
);

module.exports = router;