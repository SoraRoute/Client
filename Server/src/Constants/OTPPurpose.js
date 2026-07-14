/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 *//**
 * ---------------------------------------------------------
 * OTP Purpose Constants
 * ---------------------------------------------------------
 * Defines the purpose for every OTP generated.
 *
 * Example:
 * - REGISTER
 * - RESET_PASSWORD
 *
 * Stored in the verification_codes table.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */

module.exports = {
    REGISTER: "REGISTER",
    RESET_PASSWORD: "RESET_PASSWORD"
};