const {body} = require("express-validator");
const { changeCategoryStatus } = require("../Services/categoryService");

const addCategoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category Name is Required")
        .isLength({max:100})
        .withMessage("Category Name cannot exceed 100 characters."),

    body("description")
        .optional()
        .isString()
        .withMessage("Description Must Be a String"),

    body("parent_category_id")
        .optional({nullable:true})
        .isInt({min:1})
        .withMessage("Parent Category ID must be a positive integer."),

    body("status")
        .optional()
        .isIn(["ACTIVE","INACTIVE"])
        .withMessage("Status must be ACTIVE or INACTIVE.")
];

const updateCategoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is Required.")
        .isLength({max:100})
        .withMessage("Category name cannot exceed 100 characters."),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("parent_category_id")
        .optional({nullable:true})
        .isInt({min:1})
        .withMessage("Parent Category ID must be Positive Integer."),

    body("status")
        .optional()
        .isIn(["ACTIVE","INACTIVE"])
        .withMessage("Status must be ACTIVE or INACTIVE")
];

const changeCategoryStatusValidation = [
    body("status")
        .notEmpty()
        .withMessage("Status is Requiured.")
        .isIn(["ACTIVE","INACTIVE"])
        .withMessage("Status must be ACTIVE or INACTIVE")
];

module.exports = {
    addCategoryValidation,
    updateCategoryValidation,
    changeCategoryStatusValidation
}