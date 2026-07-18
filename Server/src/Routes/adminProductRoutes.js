const express = require("express");
const router = express.Router();

const AdminProductController = require("../controllers/adminProductController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/products",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.getAllProducts
)

router.get(
    "/products/:productId",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.getProductById
)

router.patch(
    "/products/:productId/status",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.updateProductStatus
)

router.delete(
    "/products/:productId",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.deleteProduct
)

module.exports = router;