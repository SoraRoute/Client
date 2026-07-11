const sellerService = require("../Services/sellerService");

class SellerController {
    async registerSeller(req, res) {
        try {
            const sellerData = req.body;

            const result = await sellerService.registerSeller(sellerData);

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

            return res.status(201).json({
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

    async getSellerProfile(req,res){
        try{
            const sellerId = req.user.sellerId;
            const result = await sellerService.getSellerProfile(sellerId);

            return res.status(200).json({
                sucess: true,
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