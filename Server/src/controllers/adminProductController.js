const adminProductService = require("../Services/adminProductService");

class AdminProductController{
    async getAllProducts(req,res){
        try{
            const products = await adminProductService.getAllProducts();

            return res.status(200).json({
                success: true,
                message: products.message,
                data: products.data
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    async getProductById(req,res){
        try{
            const{productId} = req.params;
            const result = await adminProductService.getProductById(productId);

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

    async updateProductStatus(req, res){
        try{
            const {productId} = req.params;
            const {status} = req.body;

            const result = await adminProductService.updateProductStatus(
                productId,
                status
            );

            return res.status(200).json({
                success: true,
                message: result.message,
            });

        }catch(error){
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteProduct(req, res){
        try{
            const{ productId } = req.params;

            const result = await adminProductService.deleteProductById(productId);

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

module.exports = new AdminProductController();