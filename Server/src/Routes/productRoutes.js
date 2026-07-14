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

router.get("/my-products",authMiddleware,
    roleMiddleware("seller"),
    productController.getSellerProducts
);

router.get("/:id",authMiddleware,
    roleMiddleware("seller"),
    productController.getProductById
);

router.put("/:id",authMiddleware,
    roleMiddleware("seller"),
    productController.updateProduct
);

router.delete("/:id",authMiddleware,
    roleMiddleware("seller"),
    productController.deleteProduct
);

router.put("/:id",authMiddleware,
    roleMiddleware("seller"),
    productController.updateStatus
)

module.exports = router;
