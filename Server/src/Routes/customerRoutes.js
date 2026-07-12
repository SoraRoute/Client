const express=require("express");
const customerController=require("../controllers/customerController");
const customerRepository = require("../Repositories/customerRepository");
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
module.exports=router