const express = require("express");

const CategoryController = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const validationMiddleware = require("../middleware/validationMiddleware");

const {
    addCategoryValidation,
    updateCategoryValidation,
    changeCategoryStatusValidation
} = require("../middleware/categoryValidation");

const router = express.Router();

router.post("/",authMiddleware,
    roleMiddleware("admin"),
    addCategoryValidation,
    validationMiddleware,
    CategoryController.addCategory
);

router.get("/customer",CategoryController.getAllCategoriesForCustomer);

router.get("/admin",
    authMiddleware,
    roleMiddleware("admin"),
    CategoryController.getAllCategoriesForAdmin
);

router.get("/:id",CategoryController.getCategoryById);

router.put("/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateCategoryValidation,
    validationMiddleware,
    CategoryController.updateCategory
);

router.delete("/:id",
    authMiddleware,
    roleMiddleware("admin"),
    CategoryController.deleteCategory
);

router.patch("/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    changeCategoryStatusValidation,
    validationMiddleware,
    CategoryController.changeCategoryStatus
);

module.exports = router;