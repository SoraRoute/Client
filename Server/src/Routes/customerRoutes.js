const express = require("express");
const customerController = require("../controllers/customerController");
const customerRepository = require("../Repositories/customerRepository");
const authenticateCustomer = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", customerController.registerCustomer);
router.post("/verify-email", customerController.verifyEmail);
router.post("/login", customerController.loginCustomer);
router.post("/forgot-password", customerController.forgotPassword);
router.post("/reset-password", customerController.resetPassword);
router.get(
  "/profile",
  authenticateCustomer,
  customerController.getCustomerProfile,
);
router.patch(
  "/profile",
  authenticateCustomer,
  customerController.updateCustomerProfile,
);
router.post("/logout", authenticateCustomer, customerController.logout);
module.exports = router;
