const { deleteProduct } = require("../Repositories/productRepository");
const productServices = require("../Services/productServices");
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

    async getSellerProducts(req,res){
        try{
            const sellerId = req.user.sellerId;
            const products = await productServices.getSellerProducts(sellerId);

            return res.status(200).json({
                success: true,
                message: "Prodcuts fetched successfully.",
                data: products
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getProductById(req,res){
        try{
            const sellerId = req.user.sellerId;
            const productId = req.params.id;

            const product = await productServices.getProductById(productId,sellerId);

            return res.status(200).json({
                success: true,
                message: "Product Fetched Successfully.",
                data: product
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

    }

    async updateProduct(req,res){
        try{
            const sellerId = req.user.sellerId;
            const productId = req.params.id;

            await productServices.updateProduct(
                productId,
                sellerId,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: "Product Updated Successfully."
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteProduct(req,res){
        try{
            const sellerId = req.user.sellerId;
            const prodcutId = req.params.id;

            await productServices.deleteProduct(prodcutId,sellerId);

            return res.status(200).json({
                success: true,
                message: "Product Deleted Successfully."
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateStatus(req,res){
        try{
            const sellerId = req.user.sellerId;
            const prodcutId = req.params.id;
            const {status} = req.body;

            await productServices.updateStatus(prodcutId,sellerId,status);

            return res.status(200).json({
                success: true,
                message: "Product Status Updated Successfully."
            });
            
        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();