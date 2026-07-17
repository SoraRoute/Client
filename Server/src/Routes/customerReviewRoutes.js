const express = require("express");
const router = express.Router();

const customerReviewController = require("../controllers/customerReviewController");
const authenticateCustomer = require("../middleware/authMiddleware");

router.post("/", authenticateCustomer, customerReviewController.addReview);
router.get(
  "/:productId",
  authenticateCustomer,
  customerReviewController.getReviews,
);
router.put(
  "/:reviewId",
  authenticateCustomer,
  customerReviewController.updateReview,
);
router.delete(
  "/:reviewId",
  authenticateCustomer,
  customerReviewController.deleteReview,
);
module.exports = router;
