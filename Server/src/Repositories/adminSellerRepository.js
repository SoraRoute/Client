class AdminSellerRepository{

    async getAllSellers(connection){
        const query = `
        SELECT 
            id,
            seller_name,
            email,
            mobile,
            gstin,
            account_status,
            created_at
        FROM sellers
        ORDER BY created_at DESC`;

        const [rows] = await connection.query(query);

        return rows;
    }

    async getSellerById(connection,sellerId){
        const query = `
        SELECT 
            id,
            seller_name,
            email,
            mobile,
            gstin,
            account_status,
            created_at
        FROM sellers
        WHERE id = ?`;

        const [rows] = await connection.query(query,[sellerId]);

        return rows[0];
    }

    async updateSellerStatus(connection,sellerId,status){
        const query = `
        UPDATE sellers
        SET account_status = ?
        WHERE id = ?`;

        const [result] = await connection.query(query,[status,sellerId]);

        return result;
    }

    async checkSellerExists(connection,sellerId){
        const query = `
        SELECT 
            id,
            account_status
        FROM sellers 
        WHERE id = ?`;

        const [rows] = await connection.query(query,[sellerId]);

        return rows[0];


    }
}

module.exports = new AdminSellerRepository();