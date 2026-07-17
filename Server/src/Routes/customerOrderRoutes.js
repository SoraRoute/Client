const express = require("express");
const router = express.Router();
const customerOrderController = require("../controllers/customerOrderController");
const authenticateCustomer = require("../middleware/authMiddleware");

router.post("/", authenticateCustomer, customerOrderController.placeOrder);

router.get("/", authenticateCustomer, customerOrderController.getOrderById);
router.get(
  "/:orderId",
  authenticateCustomer,
  customerOrderController.getOrderById,
);
router.delete(
  "/:orderId/cancel",
  authenticateCustomer,
  customerOrderController.cancelOrder,
);
module.exports = router;
