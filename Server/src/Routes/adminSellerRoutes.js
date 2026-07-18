const express = require("express");

const router = express.Router();

const adminSellerController =
require("../Controllers/adminSellerController");


const authMiddleware =
require("../Middleware/authMiddleware");

const roleMiddleware = 
require("../Middleware/roleMiddleware");


router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    adminSellerController.getAllSellers
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    adminSellerController.getSellerById
);

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    adminSellerController.updateSellerStatus
);

module.exports = router;