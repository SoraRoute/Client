const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware")

const roleMiddleware = require("../middleware/roleMiddleware")

const upload = require("../middleware/uploadMiddleware");

const validationMiddleware = require("../middleware/validationMiddleware");

const{
    addProductValidation
} = require("../middleware/productValidation");

router.post("/add",authMiddleware,
    roleMiddleware("seller"),
    upload.array("images",5),
    addProductValidation,
    validationMiddleware,
    productController.addProduct
);

module.exports = router;
