const express = require("express");
const router = express.Router();

const AdminDashboardController = require("../controllers/adminDashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    AdminDashboardController.getDashboardStatistics
);

module.exports = router;