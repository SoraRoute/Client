const express = require("express");
const router = express.Router();

const sellerController = require("../controllers/sellerController");

const authMiddleware = require("../middleware/authMiddleware")

const roleMiddleware = require("../middleware/roleMiddleware")

router.post("/send-otp",sellerController.sendSellerOtp);

router.post("/verify-otp",sellerController.verifySellerOtp);

router.post("/register",sellerController.registerSeller);

router.post("/login",sellerController.loginSeller);

router.get("/profile",authMiddleware,roleMiddleware("seller"),sellerController.getSellerProfile);

router.post("/forgot-password",sellerController.forgotPassword);

router.post("/reset-password",sellerController.resetPassword);

module.exports = router;
