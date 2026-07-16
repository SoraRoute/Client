const express = require("express");

const AdminController = require("../Controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");

const loginValidator = require("../middleware/adminLoginValidation");

const router = express.Router();

router.post(
    "/login",
    loginValidator,
    validationMiddleware,
    AdminController.loginAdmin
);

router.post(
    "/send-otp",
    AdminController.sendAdminOtp
);

router.post(
    "/verify-otp",
    AdminController.verifyAdminOtp
);

router.put(
    "/reset-password",
    AdminController.resetPassword
);

router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("admin"),
    AdminController.getAdminProfile
);

router.put(
    "/change-password",
    authMiddleware,
    roleMiddleware("admin"),
    AdminController.changeAdminPassword
);

module.exports = router;