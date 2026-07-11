/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 *//**
 * ---------------------------------------------------------
 * Mail Utility
 * ---------------------------------------------------------
 * Sends emails using Nodemailer.
 *
 * Shared by:
 * - Customer Verification
 * - Seller Verification
 * - Password Reset
 *
 * Email templates should be added here.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
const transporter=require("../Config/mailConfig");
class SendMail{
      /**
     * Sends an email.
     *
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} html - HTML content of the email
     */
    async sendEmail(to, subject, html){
        const mailOptions={
            from:process.env.EMAIL_USER,
            to,
            subject,
            html
        };
        try{
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${to}`);

        }
        catch(error){
            console.error("Email sending failed:", error.message);
            throw new Error("Unable to send email.");

        }
    }
}
module.exports=new SendMail();