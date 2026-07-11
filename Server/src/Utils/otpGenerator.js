/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * OTP Generator
 * ---------------------------------------------------------
 * Generates a secure 6-digit OTP.
 *
 * Shared by:
 * - Customer Email Verification
 * - Seller Email Verification
 * - Forgot Password
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
class OTPGenerator{
    /**
     * Generates a random 6-digit OTP.
     *
     * Example:
     * 483921
     *
     * @returns {string} Six-digit OTP
     */
    generateOTP(){
        return Math.floor(100000+Math.random()*900000).toString();
        
    }
    
}
module.exports=new OTPGenerator();