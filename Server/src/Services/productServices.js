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

    async updateProduct(productId,sellerId,productData){
        const connection = await db.getConnection();

        try{
            await connection.beginTransaction();

            const rows = await productRepository.getProductById(connection,productId,sellerId);

            if(!rows){
                throw new Error("Product Not Found");
            }

            await productRepository.updateProduct(connection,productId,sellerId,productData);

            await connection.commit()

        } catch(error){
            await connection.rollback()
            throw error

        }finally{
            connection.release();
        }
    }

    async deleteProduct(productId,sellerId){
        const connection = await db.getConnection();

        try{
            await connection.beginTransaction();

            const product = await productRepository.getProductById(connection,
                productId,
                sellerId
            );

            if(!product){
                throw new Error("Product Not Found");
            }

            const images = await productRepository.getProductImages(connection,productId);

            if(images.length > 0){
                await cloudinaryHelper.deleteMultipleImages(
                    images.map(image => image.public_id)
                );
            }

            await productRepository.deleteProductImages(connection,productId);

            await productRepository.deleteProduct(connection,productId,sellerId);

            await connection.commit();

        } catch(error){
            await connection.rollback();
            throw error;

        } finally{
            connection.release();
        }
    }

    async updateStatus(productId,sellerId,status){
        const connection = await db.getConnection();

        try{
            connection.beginTransaction();

            const allowedStatus = [
                "ACTIVE",
                "INACTIVE"
            ];

            if (!allowedStatus.includes(status)) {
                throw new Error("Invalid product status.");
            }

            const product = productRepository.getProductById(productId,sellerId);

            if(!product){
                throw new Error("Product Not Found");
            }

            productRepository.updateStatus(productId,sellerId,status);

            await connection.commit();

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }
}

module.exports = new ProductService();