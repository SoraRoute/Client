class AdminProductRepository{
    async getAllProducts(connection){
        const query = `Select
            id,
            category_id,
            title,
            description,
            brand,
            price,
            stock,
            status,
            created_at
        From products
        Order by created_at Desc
        `;

        const [rows] = await connection.query(query);

        return rows;
    }

    async getProductById(connection,productId){
        const query = `
        SELECT * FROM
        products 
        WHERE id = ?
        `;

        const [rows] = await connection.query(query,[productId]);

        return rows[0];

    }

    async updateStatus(connection,productId,status){
        const query = `
        UPDATE products 
        SET status = ? 
        WHERE id = ?`;

        const [result] = await connection.query(query,[status,productId]);

        return result;

    }

    async deleteProduct(connection,productId){
        const query = `
        DELETE FROM
        products 
        WHERE id = ?`;

        const [result] = await connection.query(query,[productId]);

        return result;
    }

    async deleteProductImages(connection,productId){
        const query = `
        DELETE FROM
        product_images 
        WHERE product_id = ?`;

        await connection.query(query,[productId]);
    }

}

module.exports = new AdminProductRepository();