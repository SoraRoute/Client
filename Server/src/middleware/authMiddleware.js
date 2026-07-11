/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 *//**
 * ---------------------------------------------------------
 * Authentication Middleware
 * ---------------------------------------------------------
 * Verifies JWT tokens.
 *
 * Adds authenticated user information to:
 *
 * req.user
 *
 * Shared by:
 * - Customer
 * - Seller
 * - Admin
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const jwtProvider = require("../utils/jwtProvider");

const authMiddleware = (req, res, next) => {

    try {

        // Read Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required."
            });
        }

        // Expected format:
        // Authorization: Bearer <token>
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });
        }

        // Verify JWT token
        const decoded = jwtProvider.verifyToken(token);
        console.log(decoded);

        // Store logged-in user information
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = authMiddleware;