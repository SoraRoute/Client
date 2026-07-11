/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * Password Utility
 * ---------------------------------------------------------
 * Handles password hashing and password comparison.
 *
 * Uses bcrypt.
 *
 * Shared by:
 * - Customer Authentication
 * - Seller Authentication
 * - Admin Authentication
 *
 * Never store plain text passwords.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const bcrypt=require("bcrypt");

class Password{


/**
     * Converts a plain-text password into a secure hashed password.
     *
     * @param {string} password - User's plain-text password
     * @returns {string} Hashed password
     */

    async hashPassword(password){
        return await bcrypt.hash(password,10);}
        /**
     * Compares the entered password with the hashed password
     * stored in the database.
     *
     * @param {string} password - Password entered by user
     * @param {string} hashedPassword - Password stored in database
     * @returns {boolean} True if passwords match
     */
        async comparePassword(password, hashedPassword){
            return await bcrypt.compare(password, hashedPassword);
        }
    }
