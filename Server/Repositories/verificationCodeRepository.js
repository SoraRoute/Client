/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * Verification Code Repository
 * ---------------------------------------------------------
 * Performs database operations for OTP records.
 *
 * Responsibilities:
 * - Save OTP
 * - Retrieve OTP
 * - Delete OTP
 * - Delete expired OTPs
 *
 * Contains database queries only.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const db = require("../config/dbConnection");

class VerificationCodeRepository{
     /**
     * Saves a new OTP record into the database.
     *
     * @param {string} email
     * @param {string} otpHash
     * @param {string} purpose
     * @param {Date} expiresAt
     */
    async createVerificationCode(email,otpHash, purpose, expiresAt){
    const sql =`INSERT INTO verification_codes 
    (email, otp_hash, purpose, expires_at)
    VALUES(?,?,?,?)`;
    await db.query(sql,[
        email,
        otpHash,
        purpose,
        expiresAt
    ]);
    
    }
      /**
     * Retrieves the latest OTP for an email and purpose.
     *
     * @param {string} email
     * @param {string} purpose
     * @returns {Object}
     */
    async findVerificationCode(email, purpose){
        const sql=`
        SELECT * FROM verification_codes
        WHERE email=?
        AND purpose=?
        ORDER BY created_at DESC
        LIMIT 1`;
        const [rows]=await db.query(sql,[
            email,
            purpose
        ]);
        return rows[0];
    }

    /**
     * Deletes all OTPs belonging to an email and purpose.
     *
     * @param {string} email
     * @param {string} purpose
     */
    async deleteVerificationCode(email, purpose){
        const sql=`DELETE FROM verification_codes
        WHERE   email=?
        AND purpose=?`;
        await db.query(sql, [
            email,
            purpose
        ]);
    }
    }
module.exports = new VerificationCodeRepository();