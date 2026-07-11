/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * Validation Middleware
 * ---------------------------------------------------------
 * Validates incoming request data before reaching controllers.
 *
 * Prevents invalid or incomplete data from being processed.
 *
 * Used with express-validator.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {

    // Collect all validation errors
    const errors = validationResult(req);

    // If validation fails, return the error response
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array()
        });
    }

    // Continue to the next middleware/controller
    next();
};

module.exports = validationMiddleware;