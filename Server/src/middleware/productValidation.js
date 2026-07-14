const { body } = require("express-validator");

const addProductValidation = [
    body("category_id")
    .notEmpty()
    .withMessage("Category ID is required.")
    .isInt({min:1})
    .withMessage("Category ID must be a positive Integer."),

    body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({max:255})
    .withMessage("Title cannot exceed 255 characters."),

    body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat("{gt:0")
    .withMessage("Discount price must be greater than 0."),

    body("brand")
    .optional()
    .trim()
    .isLength({max:100})
    .withMessage("Brand cannot exceed 100 characters."),

    body("description")
    .optional()
    .trim(),

    body("status")
    .optional()
    .isIn(["ACTIVE","INACTIVE"])
    .withMessage("Invalid product status."),
];

module.exports = {
    addProductValidation
}