const { body } = require("express-validator");
const validationMiddleware = require("./validationMiddleware");

const validateSellerProfile = [
    body("sellerName")
        .trim()
        .notEmpty()
        .withMessage("Seller name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Seller name must be between 3 and 100 characters."),

    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required.")
        .isMobilePhone("en-IN")
        .withMessage("Please enter a valid Indian mobile number."),

    body("gstin")
        .trim()
        .notEmpty()
        .withMessage("GSTIN is required.")
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
        .withMessage("Please enter a valid GSTIN."),

    validationMiddleware
];

module.exports = validateSellerProfile;