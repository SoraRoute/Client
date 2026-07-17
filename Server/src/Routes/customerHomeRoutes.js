const express = require("express");
const router = express.Router();
const authenticateCustomer = require("../middleware/authMiddleware");
const customerHomeController = require("../controllers/customerHomeController");

router.get("/", customerHomeController.getHomePage);
module.exports = router;
