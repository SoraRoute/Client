const sellerService = require("../Services/sellerService");

class SellerController {
    async sendSellerOtp(req,res){
        try{
            const {email} = req.body;
            const result = await sellerService.sendSellerOtp(email,"REGISTER");

            return res.status(200).json({
                success: true,
                message: result.message
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            });  
        }
    }

    async verifySellerOtp(req,res){
        try{
            const{email,otp} = req.body;

            const result = await sellerService.verifySellerOtp(email,otp,"REGISTER");

            return res.status(200).json({
                success: true,
                message: result.message,
                verificationToken: result.verificationToken
            });

        } catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async registerSeller(req, res) {
        try {
            const sellerData = req.body;
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new Error("Verification token is required.");
            }

            const verificationToken = authHeader.split(" ")[1];

            const result = await sellerService.registerSeller(sellerData,verificationToken);

            return res.status(201).json({
                success: true,
                message: result.message,
                sellerId: result.sellerId
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async loginSeller(req,res){
        try{
            const loginData = req.body;
            const result = await sellerService.loginSeller(loginData);

            return res.status(200).json({
                success: true,
                message: result.message,
                token: result.token
            });
        }
        catch(error){
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }  
    }

    async forgotPassword(req,res){
        try{
            const{email} = req.body;

            const result = await sellerService.sendSellerOtp(email,"RESET_PASSWORD");

            return res.status(200).json({
                sucess: true,
                message: result.message
            });
        } catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async resetPassword(req,res){
        try{
            const{email,otp,newPassword} = req.body;

            const result = await sellerService.resetPassword(email,otp,newPassword);

            return res.status(200).json({
                success: true,
                message: result.message
            });

        }catch(error){
            return res.status(400).json({
                sucess:false,
                message: error.message
            });
        }
    }
    
    async getSellerProfile(req,res){
        try{
            const sellerId = req.user.sellerId;
            const result = await sellerService.getSellerProfile(sellerId);

            return res.status(200).json({
                success: true,
                message: "Seller Profile Fetched Successfully.",
                sellerData: result
            })

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        } 
    }
}

module.exports = new SellerController();