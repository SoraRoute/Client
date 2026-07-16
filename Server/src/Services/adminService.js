const db = require("../Config/dbConnection");
const bcrypt = require("bcrypt");

const AdminRepository = require("../Repositories/adminRepository");
const jwtProvider = require("../Utils/jwtProvider");

const otpGenerator = require("../Utils/otpGenerator");
const sendMail = require("../Utils/sendMail");
const constants = require("../Constants/OTPPurpose");

class AdminService{

    async loginAdmin(loginData) {
        
        const connection = await db.getConnection();
        try {
            const email = loginData.email.trim().toLowerCase();

            const existingAdmin = await AdminRepository.findAdminByEmail(connection, email);

            if (existingAdmin.length === 0) {
                throw new Error("Invalid email or password.");
            }

            const admin = existingAdmin[0];

            const isMatch = await bcrypt.compare(
                loginData.password,
                admin.password
            );

            if (!isMatch) {
                throw new Error("Invalid email or password.");
            }

            const token = jwtProvider.generateToken({
                adminId: admin.id,
                role: admin.role
            });

            return {
                message: "Login successful.",
                token
            };

        } finally {
            connection.release();
        }
    }

    async getAdminProfile(adminId) {

        const connection = await db.getConnection();
        try {
            const admin = await AdminRepository.findAdminById(connection, adminId);

            if (admin.length === 0) {
                throw new Error("Admin not found.");
            }
            return admin[0];

        }finally {
            connection.release();
        }
    }

    async changeAdminPassword(adminId, passwordData) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const adminPassword = await AdminRepository.findAdminPasswordById(connection, adminId);

            if (adminPassword.length === 0) {
                throw new Error("Admin not found.");
            }

            const currentHash = adminPassword[0].password;

            const isOldPasswordCorrect = await bcrypt.compare(
                passwordData.oldPassword,
                currentHash
            );

            if (!isOldPasswordCorrect) {
                throw new Error("Old password is incorrect.");
            }

            if (passwordData.newPassword.length < 8) {
                throw new Error(
                    "New password must be at least 8 characters."
                );
            }

            const isSamePassword = await bcrypt.compare(
                passwordData.newPassword,
                currentHash
            );

            if (isSamePassword) {
                throw new Error(
                    "New password cannot be the same as the old password."
                );
            }

            const hashedPassword =
                await bcrypt.hash(passwordData.newPassword, 10);

            await AdminRepository.updateAdminPasswordById(
                connection,
                adminId,
                hashedPassword
            );

            await connection.commit();

            return {
                message: "Password changed successfully."
            };

        }catch(error){
            await connection.rollback();
            throw error;

        }finally {
            connection.release();
        }
    }

    async sendAdminOtp(email) {

        const connection = await db.getConnection();
        try{
            await connection.beginTransaction();
            email = email.trim().toLowerCase();

            const existingAdmin = await AdminRepository.findAdminByEmail(connection, email);

            if (existingAdmin.length === 0) {
                throw new Error("Admin does not exist.");
            }

            const otp = otpGenerator.generateOTP();

            const otpHash = await bcrypt.hash(otp, 10);

            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await AdminRepository.deleteOtp(
                connection,
                email,
                constants.RESET_PASSWORD
            );

            await AdminRepository.saveOtp(
                connection,
                email,
                otpHash,
                constants.RESET_PASSWORD,
                expiresAt
            );

            await sendMail.sendEmail(
                email,
                "Admin Password Reset OTP",
                `
                <h2>Your OTP is ${otp}</h2>
                <p>This OTP is valid for 10 minutes.</p>
                `
            );

            await connection.commit();

            return {
                message: "OTP sent successfully."
            };

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }

    async verifyAdminOtp(connection, email, otp, purpose) {

        const otpData = await AdminRepository.findOtpByEmail(connection, email, purpose);

        if (!otpData) {
            throw new Error("OTP not found or has expired.");
        }

        if (new Date(otpData.expires_at) < new Date()) {
            await AdminRepository.deleteOtp(connection, email, purpose);
            throw new Error("OTP has expired.");
        }

        const isMatch = await bcrypt.compare(
            otp,
            otpData.otp_hash
        );

        if(!isMatch){
            throw new Error("Invalid OTP.");
        }

        return {
            message: "OTP verified successfully."
        };
    }

    async verifyOtp(email, otp, purpose) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            email = email.trim().toLowerCase();

            const result = await this.verifyAdminOtp(
                connection,
                email,
                otp,
                purpose
            );

            await connection.commit();
            return result;

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }

    async resetPassword(email, otp, newPassword) {

        const connection = await db.getConnection();

        try{

            await connection.beginTransaction();

            email = email.trim().toLowerCase();

            const admin = await AdminRepository.findAdminByEmail(connection, email);

            if (admin.length === 0) {
                throw new Error("Admin does not exist.");
            }

            if (newPassword.length < 8) {
                throw new Error("Password must be at least 8 characters.");
            }

            await this.verifyAdminOtp(
                connection,
                email,
                otp,
                constants.RESET_PASSWORD
            );

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await AdminRepository.updateAdminPasswordByEmail(
                connection,
                email,
                hashedPassword
            );
            
            await AdminRepository.deleteOtp(connection, email, constants.RESET_PASSWORD);
            await connection.commit();

            return{
                message: "Password changed successfully."
            };

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }
}

module.exports = new AdminService();