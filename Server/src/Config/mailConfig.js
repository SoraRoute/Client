/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * Mail Configuration
 * ---------------------------------------------------------
 * Configures the Nodemailer transporter.
 *
 * Reads email credentials from .env.
 *
 * Shared by all email services.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
require("dotenv").config();
const nodemailer=require("nodemailer");
/**
 * Creates a reusable transporter object.
 * The transporter will be used by sendMail.js
 */
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    
    }
})
module.exports=transporter;