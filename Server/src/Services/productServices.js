const db = require("../Config/dbConnection");
const productRepository = require("../Repositories/productRepository");
const cloudinaryHelper = require("../Utils/cloudinaryHelper");


class ProductService{
    
    async addProduct(sellerId,productData,files){
        const connection = await db.getConnection();

        let uploadedImages = [];

        try{
            await connection.beginTransaction();

            if (!files || files.length === 0) {
                throw new Error("At least one product image is required.");
            }

            productData.seller_id = sellerId;

            uploadedImages = await cloudinaryHelper.uploadMultipleImages(files);

            const productId = await productRepository.createProduct(connection,productData);

            await productRepository.addProductImages(connection,productId,uploadedImages);

            await connection.commit();

            return{
                success: true,
                message: "Product Added Successfully.",
                productId
            };

        } catch(error){
            await connection.rollback();

            if(uploadedImages.length > 0){
                await cloudinaryHelper.deleteMultipleImages(uploadedImages.map(image => image.public_id));
            }
            throw error;
            
        } finally{
            connection.release();
        }
    }

    async getSellerProducts(sellerId){
        const connection = await db.getConnection();

        try{
            await connection.beginTransaction();
            const products = await productRepository.getSellerProducts(connection,sellerId);

            await connection.commit();
            return products;

        } catch(error){
            await connection.rollback();
            throw error;

        } finally{
            connection.release();
        }
    }

    async getProductById(productId,sellerId){
        const connection = await db.getConnection();

        try{
            const products = await productRepository.getProductById(connection,productId,sellerId);

            if(!products){
                throw new Error("Product Not Found");
            }

            const images = await productRepository.getProductImages(connection,productId);

            products.images = images;
            await connection.commit();

            return products;

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }
}

module.exports = new ProductService();