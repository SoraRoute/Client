const express = require("express");
const router = express.Router();
const customerCartController = require("../controllers/customerCartController");
const authenticateCustomer = require("../middleware/authMiddleware");

router.post(
  "/:productId",
  authenticateCustomer,
  customerCartController.addToCart,
);

router.get("/", authenticateCustomer, customerCartController.getCart);
router.patch(
  "/:productId",
  authenticateCustomer,
  customerCartController.updateCartItem,
);
router.delete(
  "/:productId",
  authenticateCustomer,
  customerCartController.removeFromCart,
);
module.exports = router;
