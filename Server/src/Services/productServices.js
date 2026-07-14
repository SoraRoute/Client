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
}

module.exports = new ProductService();