const db = require("../Config/dbConnection");
const AdminProductRepository = require("../Repositories/adminProductRepository");

class AdminProductService{
    async getAllProducts(){
        const connection = await db.getConnection();

        try{
            const result = await AdminProductRepository.getAllProducts(connection);

            return{
                success: true,
                data: result,
                message: "Products fetched successfully."
            }

        }catch(error){
            throw error;

        }finally{
            connection.release();
        }
    }

    async getProductById(productId){
        const connection = await db.getConnection();

        try{
            
            const product = await AdminProductRepository.getProductById(connection,productId);

            if(!product){
                throw new Error("Product Not Found.");
            }

            return{
                success: true,
                data: product,
                message: "Product fetched successfully."
            }

        }catch(error){
            throw error;

        }finally{
            connection.release();
        }
    }

    async updateProductStatus(productId,status){

        const connection = await db.getConnection();

        try{

            const allowedStatus = [
                "ACTIVE",
                "INACTIVE"
            ];

            if (!allowedStatus.includes(status)) {
                throw new Error("Invalid product status.");
            }

            const existingProduct = await AdminProductRepository.getProductById(connection,productId);

            if(!existingProduct){
                throw new Error("Product Not Found.");
            }

            const updatedProduct = await AdminProductRepository.updateStatus(connection,productId,status);

            if(updatedProduct.affectedRows === 0){
                throw new Error("Failed to update product status.");
            }

            await connection.commit();

            return{
                success: true,
                message: "Status updated successfully."
            }

        }catch(error){
            throw error;

        }finally{
            connection.release();
        }
    }

    async deleteProductById(productId){
         const connection = await db.getConnection();

        try{
            await connection.beginTransaction();

            const existingProduct = await AdminProductRepository.getProductById(connection,productId);

            if(!existingProduct){
                throw new Error("Product Not Found.");
            }

            await AdminProductRepository.deleteProduct(connection,productId);

            await AdminProductRepository.deleteProductImages(connection,productId);

            await connection.commit();

            return{
                success: true,
                message: "Product Deleted successfully."
            }

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }
}

module.exports = new AdminProductService();