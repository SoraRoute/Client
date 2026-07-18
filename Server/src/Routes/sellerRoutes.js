const express = require("express");
const router = express.Router();

const sellerController = require("../controllers/sellerController");

const authMiddleware = require("../middleware/authMiddleware")

const roleMiddleware = require("../middleware/roleMiddleware")

const validateSellerProfile = require("../middleware/validationSellerProfile")

const validateChangePassword = require("../middleware/validationChangePassword")

router.post(
    "/send-otp",
    sellerController.sendSellerOtp
);

router.post(
    "/verify-otp",
    sellerController.verifySellerOtp
);

router.post(
    "/register",
    sellerController.registerSeller
);

router.post(
    "/login",
    sellerController.loginSeller
);

router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.getSellerProfile
);

router.post(
    "/forgot-password",
    sellerController.forgotPassword
);

router.post(
    "/reset-password",
    sellerController.resetPassword
);

router.patch(
    "/update-profile",
    authMiddleware,
    roleMiddleware("seller"),
    validateSellerProfile,
    sellerController.updateSellerProfile
);

router.patch(
    "/change-password",
    authMiddleware,
    roleMiddleware("seller"),
    validateChangePassword,
    sellerController.changePassword
);


// Seller Orders
router.get(
    "/orders",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.getSellerOrders
);

// Seller Revenue
router.get(
    "/revenue",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.getSellerRevenue
);

// Update Order Status
router.patch(
    "/orders/:orderId/status",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.updateOrderStatus
);

//add this logout route
router.post("/logout", authMiddleware, sellerController.logout);

module.exports = router;
