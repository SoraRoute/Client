class AdminDashboardRepository{
    async getDashboardStatistics(connection){
        const query = `
        SELECT 
            (SELECT COUNT(*) FROM sellers) as totalSellers,

            (SELECT COUNT(*) FROM sellers WHERE account_status = 'ACTIVE') as activeSellers,

            (SELECT COUNT(*) FROM sellers WHERE account_status = 'INACTIVE') as inactiveSellers,

            (SELECT COUNT(*) FROM products) as totalProducts,

            (SELECT COUNT(*) FROM products WHERE status = 'ACTIVE') as activeProducts,

            (SELECT COUNT(*) FROM products WHERE status = 'INACTIVE') as inactiveProducts,

            (SELECT COUNT(*) FROM categories) as totalCategories,

            (SELECT COUNT(*) FROM products WHERE stock < 10) as lowStockProducts;
        `
        const [rows] = await connection.query(query);

        return rows[0];
    }
}

module.exports = new AdminDashboardRepository();