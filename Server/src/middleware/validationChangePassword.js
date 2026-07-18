const { body } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");

const validateChangePassword = [
    body("oldPassword")
        .trim()
        .notEmpty()
        .withMessage("Old password is required."),

    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long.")
        .matches(/[A-Z]/)
        .withMessage("New password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("New password must contain at least one lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("New password must contain at least one number.")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("New password must contain at least one special character."),

    validationMiddleware
];

module.exports = validateChangePassword;