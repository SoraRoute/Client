const express = require("express");
const router = express.Router();

const sellerController = require("../controllers/sellerController");

const authMiddleware = require("../middleware/authMiddleware")

const roleMiddleware = require("../middleware/roleMiddleware")

router.post("/register",sellerController.registerSeller);

router.post("/login",sellerController.loginSeller);

router.get("/profile",authMiddleware,roleMiddleware("seller"),sellerController.getSellerProfile);

module.exports = router;
