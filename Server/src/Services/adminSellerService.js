const db = require("../Config/dbConnection");
const AdminSellerRepository = require("../Repositories/adminSellerRepository");

class AdminSellerService{
    async getAllSellers(){
        const connection = await db.getConnection();

        try{
            const result = await AdminSellerRepository.getAllSellers(connection);

            return{
                success: true,
                data: result,
                message: "Sellers fetched successfully."
            }

        }catch(error){
            throw error;

        }finally{
            connection.release();
        }
    }

    async getSellerById(sellerId){
        const connection = await db.getConnection();
        try{
            const result = await AdminSellerRepository.getSellerById(connection,sellerId);

            if(!result){
                throw new Error("Seller Not Found.");
            }

            return{
                success: true,
                data: result,
                message: "Seller fetched successfully."
            }

        }catch(error){
            throw error;

        }finally{
            connection.release();
        }
    }

    async updateSellerStatus(sellerId,status){
        const connection = await db.getConnection();
        try{
            await connection.beginTransaction();

            const allowedStatus = ["PENDING", "ACTIVE", "SUSPENDED"];

            if (!allowedStatus.includes(status)) {
                throw new Error("Invalid seller status.");
            }

            const existingSeller = await AdminSellerRepository.checkSellerExists(connection,sellerId);
            
            if(!existingSeller){
                throw new Error("Seller Not Found.");
            }

            
            if (existingSeller.account_status === status) {
                throw new Error(`Seller is already ${status}.`);
            }
        
            const result = await AdminSellerRepository.updateSellerStatus(connection,sellerId,status);

            if (result.affectedRows === 0) {
                throw new Error("Failed to update seller status.");
            }

            await connection.commit();

            return{
                success:true,
                data:{
                    sellerId,
                    status
                },
                message:"Seller status updated successfully."
            }

        }catch(error){
            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }
}

module.exports = new AdminSellerService();