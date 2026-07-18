const bcrypt = require("bcrypt");

const db = require("../Config/dbConnection");
const sellerRepository = require("../Repositories/sellerRepository");
const jwtProvider = require("../Utils/jwtProvider");
const otpGenerator = require("../Utils/otpGenerator");
const sendMail = require("../Utils/sendMail");
const constants = require("../Constants/OTPPurpose")


class SellerService{

    async sendSellerOtp(email,purpose){
        
        const connection = await db.getConnection();

        try{
            await connection.beginTransaction();

            const existingSeller = await sellerRepository.findSellerByEmail(connection,email);

            if(purpose === constants.REGISTER && existingSeller){
                throw new Error("Seller Already Registered.");
            }

            if(purpose === "RESET_PASSWORD" &&!existingSeller){
                throw new Error("Seller does not exist.");
            }

            const otp = otpGenerator.generateOTP();

            const otpHash = await bcrypt.hash(otp,10);

            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await sellerRepository.deleteOtp(connection,email,purpose);

            await sellerRepository.saveOtp(connection,email,otpHash,purpose,expiresAt);

            const subject = purpose === constants.REGISTER ? "Seller Registration OTP" : " Reset Password OTP";

            await sendMail.sendEmail(
                email,
                subject,
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

    async registerSeller(sellerData,verificationToken){
        const connection = await db.getConnection();

        try{

            await connection.beginTransaction();

            const decodedToken = jwtProvider.verifyVerificationToken(verificationToken);

            if(decodedToken.email !== sellerData.email){
                throw new Error("Email Does not match the verified Email.");
            }

            const existingSeller = await sellerRepository.findSellerByEmail(
                connection,sellerData.email
            );

            if(existingSeller){
                throw new Error("Email Already Registered.")
            }

            const hashedPassword = await bcrypt.hash(sellerData.passwordd,10);
            sellerData.passwordd = hashedPassword;

            const sellerId = await sellerRepository.createSeller(connection,sellerData);

            await sellerRepository.createAddress(connection,sellerId,sellerData.address);

            await sellerRepository.createBusinessDetails(connection,sellerId,sellerData.business);

            await sellerRepository.createBankDetails(connection,sellerId,sellerData.bank);

            await connection.commit();

            return{
            message:"Seller Registered Successfully",
            sellerId
        };

        }catch(error){

            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }

    async verifySellerOtp(email,otp,purpose){
        const connection = await db.getConnection();
         
        try{
            await connection.beginTransaction();

            const otpRecord = await sellerRepository.findOtpByEmail(connection,email,purpose);

            if(!otpRecord){
                throw new Error("OTP not found or has expired.");
            }

            if(otpRecord.expires_at < new Date()){
                throw new Error("OTP has expired.");
            }

            const isMatch = await bcrypt.compare(otp,otpRecord.otp_hash);

            if(!isMatch){
                throw new Error("Invalid OTP.");
            }

            await sellerRepository.deleteOtp(connection,email,purpose);

            let result = {
                message : "OTP Verified Successfully."
            };

            if(purpose === constants.REGISTER){
                result.message = "Email Verified Sucessfully.";
                result.verificationToken = jwtProvider.generateVerificationToken(email);

            }

            await connection.commit();

            return result;

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }

    async loginSeller(loginData){
        const connection = await db.getConnection();
        try{
            const existingSeller = await sellerRepository.findSellerByEmail(connection,loginData.email);

            if(!existingSeller){
                throw new Error("Invalid Email or Password");
            }

            const seller = existingSeller;

            const isMatch = await bcrypt.compare(
                loginData.passwordd,
                seller.passwordd
            );

            if(!isMatch){
                throw new Error("Invalid Email or Password");
            }

            const token = jwtProvider.generateToken({
                sellerId:seller.id,
                role:seller.role
            });

            return{
                message: "Login Successful",
                token:token
            };
        }
        catch(error){
            await connection.rollback();
            throw error;
        }
        finally{
            connection.release();
        }       
    }

    async resetPassword(email,otp,newPassword){
        const connection = await db.getConnection();

        try{
            await connection.beginTransaction();

            const seller = await sellerRepository.findSellerByEmail(connection,email);

            if(!seller){
                throw new Error("Seller does not exist.");
            }

            await this.verifySellerOtp(email,otp,"RESET_PASSWORD");

            const hashedPassword = await bcrypt.hash(newPassword,10);

            await sellerRepository.updateSellerPassword(connection,email,hashedPassword);

            await connection.commit();

            return{
                message: "Password Changed Sucessfully."
            };
            
        }catch(error){
            await connection.rollback();
            throw error;
        }
        finally{
            connection.release();
        }   
    }

    async getSellerProfile(id){
        const connection = await db.getConnection();

        try{
            const existingSeller = await sellerRepository.getSellerById(connection,id);

            if(!existingSeller){
                throw new Error("Seller Do Not Exist.");
            }

            return existingSeller;

        }finally{
            connection.release();
        }
    }

    async updateSellerProfile(sellerId,sellerData){
        const connection = await db.getConnection();

        try{
            await connection.beginTransaction();

            const existingSeller = await sellerRepository.getSellerById(connection,sellerId);

            if(!existingSeller){
                throw new Error("Seller does not exist.");
            }

            const existingSellerWithSameData = await sellerRepository.checkSellerExists(connection,sellerData.mobile,sellerData.gstin,sellerId);

            if(existingSellerWithSameData){
                throw new Error("Mobile number or GSTIN already exists.");
            }

            const result = await sellerRepository.updateSellerProfile(connection,sellerId,sellerData);

            if (result.affectedRows === 0) {
                throw new Error("Failed to update profile.");
            }

            await connection.commit();

            return{
                success: true,
                message: "Profile updated successfully."
            };

        }catch(error){
            await connection.rollback();
            throw error;
        }
        finally{
            connection.release();
        }  
    }

    async changePassword(sellerId, passwordData) {
    const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const seller = await sellerRepository.getSellerPassword(
                connection,
                sellerId
            );

            if (!seller) {
                throw new Error("Seller does not exist.");
            }

            const isPasswordValid = await bcrypt.compare(
                passwordData.oldPassword,
                seller.passwordd
            );

            if (!isPasswordValid) {
                throw new Error("Current password is incorrect.");
            }

            const isSamePassword = await bcrypt.compare(
                passwordData.newPassword,
                seller.passwordd
            );

            if (isSamePassword) {
                throw new Error("New password cannot be the same as the current password.");
            }

            const hashedPassword = await bcrypt.hash(
                passwordData.newPassword,
                10
            );

            const result = await sellerRepository.updatePassword(
                connection,
                sellerId,
                hashedPassword
            );

            if (result.affectedRows === 0) {
                throw new Error("Failed to change password.");
            }

            await connection.commit();

            return {
                success: true,
                message: "Password changed successfully."
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getSellerOrders(sellerId) {
        const connection = await db.getConnection();

        try {
            const orders = await sellerRepository.getSellerOrders(
                connection,
                sellerId
            );

            return {
                success: true,
                data: orders,
                message: "Seller orders fetched successfully."
            };

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    async getSellerRevenue(sellerId) {
        const connection = await db.getConnection();

        try {

            const revenue = await sellerRepository.getSellerRevenue(
                connection,
                sellerId
            );

            return {
                success: true,
                data: revenue,
                message: "Seller revenue fetched successfully."
            };

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    async updateOrderStatus(orderId, sellerId, orderStatus) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const allowedStatus = [
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ];

            if (!allowedStatus.includes(orderStatus)) {
                throw new Error("Invalid order status.");
            }

            const existingOrder = await sellerRepository.getOrderById(
                connection,
                orderId,
                sellerId
            );

            if (!existingOrder) {
                throw new Error("Order not found.");
            }

            const result = await sellerRepository.updateOrderStatus(
                connection,
                orderId,
                orderStatus
            );

            if (result.affectedRows === 0) {
                throw new Error("Failed to update order status.");
            }

            await connection.commit();

            return {
                success: true,
                message: "Order status updated successfully."
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

}

module.exports = new SellerService();