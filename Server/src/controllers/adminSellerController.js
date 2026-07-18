const AdminSellerService = require("../Services/adminSellerService");

class AdminSellerController{

    async getAllSellers(req,res){
        try{
            const sellers = await AdminSellerService.getAllSellers();

            return res.status(200).json({
                success: true,
                message: sellers.message,
                data: sellers.data
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    async getSellerById(req,res){
        try{
            const sellerId = req.params.id;

            const result = await AdminSellerService.getSellerById(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }    
    }

    async updateSellerStatus(req, res) {
        try {

            const sellerId = req.params.id;
            const {account_status} = req.body;

            if(!account_status){
                return res.status(400).json({
                    success: false,
                    message: "Account status is required."
                });
            }

            const result = await AdminSellerService.updateSellerStatus(
                sellerId,
                account_status
            );

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        }catch(error){
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

}

module.exports = new AdminSellerController();