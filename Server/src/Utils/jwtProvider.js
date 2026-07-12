/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * JWT Provider
 * ---------------------------------------------------------
 * Generates and verifies JWT tokens.
 *
 * Shared by:
 * - Customer Authentication
 * - Seller Authentication
 * - Admin Authentication
 *
 * Token Payload Example:
 * {
 *    id,
 *    email,
 *    role
 * }
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
require("dotenv").config();
const jwt=require('jsonwebtoken');

const secretKey=process.env.JWT_SECRET;

// Modifications Done for Seller
const verificationSecret = process.env.JWT_VERIFICATION_SECRET;

class JwtProvider{
    /**
     * Generates a JWT token from the given payload.
     *
     * Example Payload:
     * {
     *   sellerId: 1,
     *   role: "seller"
     * }
     *
     * @param {Object} payload
     * @returns {string} JWT Token
     */
    generateToken(payload){
        return jwt.sign(payload, secretKey,{expiresIn:"24h"});

    }

    /**
     * Verifies whether the JWT token is valid.
     *
     * If valid, returns the decoded payload.
     * If invalid or expired, throws an error.
     *
     * @param {string} token
     * @returns {Object} Decoded JWT payload
     */
    verifyToken(token){
        try{
            return jwt.verify(token, secretKey);

        }
        catch(error){
            throw new Error("Invalid or Expired Token");
        }
    }

    //Mofications done for verification token generation for seller verification

    generateVerificationToken(email){
        return jwt.sign(
            {
                email,
                purpose: "REGISTER",
            },
            verificationSecret,
            {
                expiresIn: "10m"
            }
        );
    }

    verifyVerificationToken(token){
        try{
            const decode = jwt.verify(token,verificationSecret);

            if(decode.purpose !== "REGISTER"){
                throw new Error("Invalid Verification Token");
            }

            return decode;

        }catch(error){
            throw new Error("Invalid or Expired Verification Token.")
        }
    }


}
module.exports=new JwtProvider();