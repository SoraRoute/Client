/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */

/**
 * ---------------------------------------------------------
 * Verification Code Service
 * ---------------------------------------------------------
 * Handles OTP business logic.
 *
 * Responsibilities:
 * - Generate OTP
 * - Save OTP
 * - Send email
 * - Verify OTP
 * - Handle OTP expiration
 *
 * Uses:
 * - otpGenerator
 * - sendMail
 * - verificationCodeRepository
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const passwordUtil = require("../Utils/password");
const otpGenerator = require("../Utils/otpGenerator");
const sendMail = require("../Utils/sendMail");
const verificationCodeRepository = require("../Repositories/verificationCodeRepository");

class VerificationCodeService {

    /**
     * Generates an OTP, hashes it, stores it in the database,
     * and sends it to the user's email.
     *
     * @param {string} email
     * @param {string} purpose
     */
    async sendVerificationCode(email, purpose) {

        // Generate a 6-digit OTP
        const otp = otpGenerator.generateOTP();

        // Hash the OTP before storing
        const otpHash = await passwordUtil.hashPassword(otp);

        // OTP expires in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Remove any previous OTP for this email & purpose
        await verificationCodeRepository.deleteVerificationCode(
            email,
            purpose
        );

        // Save the new OTP
        await verificationCodeRepository.createVerificationCode(
            email,
            otpHash,
            purpose,
            expiresAt
        );

        // Send OTP email
        await sendMail.sendEmail(
            email,
            "MarketHive Verification Code",
            `
                <h2>Email Verification</h2>

                <p>Your OTP is:</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 10 minutes.</p>

                <p>Do not share this OTP with anyone.</p>
            `
        );
    }

    /**
     * Verifies the OTP entered by the user.
     *
     * @param {string} email
     * @param {string} purpose
     * @param {string} enteredOTP
     * @returns {boolean}
     */
    async verifyCode(email, purpose, enteredOTP) {

        const verificationCode =
            await verificationCodeRepository.findVerificationCode(
                email,
                purpose
            );

        if (!verificationCode) {
            throw new Error("OTP not found.");
        }

        if (new Date() > verificationCode.expires_at) {

            await verificationCodeRepository.deleteVerificationCode(
                email,
                purpose
            );

            throw new Error("OTP has expired.");
        }

        const isMatch =
            await passwordUtil.comparePassword(
                enteredOTP,
                verificationCode.otp_hash
            );

        if (!isMatch) {
            throw new Error("Invalid OTP.");
        }

        // Delete OTP after successful verification
        await verificationCodeRepository.deleteVerificationCode(
            email,
            purpose
        );

        return true;
    }

}

module.exports = new VerificationCodeService();