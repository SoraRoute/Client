const express=require("express");
const customerController=require("../controllers/customerController");
const customerRepository = require("../Repositories/customerRepository");
const authenticateCustomer = require("../Middleware/customerAuthMiddleware");
const router=express.Router();
router.post(
    "/register",
    customerController.registerCustomer
);
router.post(
    "/verify-email",
    customerController.verifyEmail
);
router.post(
    "/login",
    customerController.loginCustomer
);
router.post(
    "/forgot-password",
    customerController.forgotPassword
);
router.post(
    "/reset-password",
    customerController.resetPassword
);router.get(
    "/profile",
    authenticateCustomer,
    customerController.getCustomerProfile
);
router.patch(
    "/profile",
    authenticateCustomer,
    customerController.updateCustomerProfile
);
module.exports=router