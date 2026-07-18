const sellerDashboardService = require("../Services/sellerDashboardService");

class SellerDashboardController{
    async getDashboardSummary(req,res){
        try{
            const sellerId = req.user.sellerId;
        
            const result = await sellerDashboardService.getDashboardSummary(sellerId);

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

    async getProductStatistics(req,res){
        try{
            const sellerId = req.user.sellerId;
        
            const result = await sellerDashboardService.getProductStatistics(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getRecentProducts(req,res){
        try{
            const sellerId = req.user.sellerId;
        
            const result = await sellerDashboardService.getRecentProducts(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getCategoryWiseProductCount(req,res){
        try{
            const sellerId = req.user.sellerId;
        
            const result = await sellerDashboardService.getCategoryWiseProductCount(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new SellerDashboardController();