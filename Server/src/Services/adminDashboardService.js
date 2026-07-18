const db = require("../Config/dbConnection");
const AdminDashboardRepository = require("../Repositories/adminDashboardRepositroy");

class AdminDashboardService{
    async getDashboardStatistics(){
        const connection = await db.getConnection();
        try{
            const result = await AdminDashboardRepository.getDashboardStatistics(connection);

            return{
                success: true,
                message: "Statistics Fechted successfully.",
                data: result
            }

        }catch(error){
            throw error;

        }finally{
            connection.release();
        }
    }
}

module.exports = new AdminDashboardService();