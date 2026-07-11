/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * Async Handler
 * ---------------------------------------------------------
 * Wraps async route handlers and forwards errors
 * to the global error middleware.
 *
 * Eliminates repetitive try/catch blocks.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const asyncHandler = (controller) => {

    return async (req, res, next) => {

        try {

            await controller(req, res, next);

        } catch (error) {

            next(error);

        }

    };

};

module.exports = asyncHandler;