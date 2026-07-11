/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * Role Middleware
 * ---------------------------------------------------------
 * Restricts access based on user roles.
 *
 * Example:
 *
 * authorize(["ADMIN"])
 *
 * authorize(["SELLER"])
 *
 * authorize(["CUSTOMER"])
 *
 * Shared across all protected routes.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const roleMiddleware = (...allowedRoles) => {

    return (req, res, next) => {

        try {

            // Check if authentication middleware has attached user data
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access."
                });
            }

            // Check whether the user's role is allowed
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied."
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

};

module.exports = roleMiddleware;