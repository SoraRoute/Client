const express = require("express");
const router = express.Router();

const customerPaymentController = require("../controllers/customerPaymentController");
const authenticateCustomer = require("../middleware/authMiddleware");

router.post("/", authenticateCustomer, customerPaymentController.makePayment);
router.get(
  "/:orderId",
  authenticateCustomer,
  customerPaymentController.getPayment,
);

module.exports = router;
