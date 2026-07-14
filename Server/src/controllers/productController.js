const ProductService = require("../Services/productServices");

class ProductController{

    async addProduct(req,res,next){
        try{
            const sellerId = req.user.sellerId;
            const response = await ProductService.addProduct(
                sellerId,
                req.body,
                req.files
            );

            return res.status(201).json(response);
            
        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();