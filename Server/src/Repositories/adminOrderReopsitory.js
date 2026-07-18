class AdminOrderRepository {

    async getAllOrders(connection) {
        const query = `
            SELECT
                o.id AS order_id,
                u.first_name,
                u.last_name,
                u.email,
                o.total_amount,
                o.order_status,
                o.created_at
            FROM orders o
            INNER JOIN users u
                ON o.user_id = u.id
            ORDER BY o.created_at DESC;
        `;

        const [rows] = await connection.query(query);

        return rows;
    }

    async getOrderById(connection, orderId) {
        const query = `
            SELECT
                o.id AS order_id,
                u.first_name,
                u.last_name,
                u.email,
                p.title,
                oi.quantity,
                oi.price,
                (oi.quantity * oi.price) AS total_price,
                o.total_amount,
                o.order_status,
                o.created_at
            FROM orders o
            INNER JOIN users u
                ON o.user_id = u.id
            INNER JOIN order_items oi
                ON o.id = oi.order_id
            INNER JOIN products p
                ON oi.product_id = p.id
            WHERE o.id = ?;
        `;

        const [rows] = await connection.query(query, [orderId]);

        return rows;
    }

    async updateOrderStatus(connection, orderId, orderStatus) {
        const query = `
            UPDATE orders
            SET order_status = ?
            WHERE id = ?;
        `;

        const [result] = await connection.query(query, [
            orderStatus,
            orderId
        ]);

        return result;
    }

}

module.exports = new AdminOrderRepository();