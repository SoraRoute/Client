const db = require("../Config/dbConnection");
class CustomerOrderRepository {
  async createOrder(userId, totalAmount) {
    const sql = `
    insert into orders(user_id,total_amount,order_status) values
    (?,?,?)
    
    `;
    const [result] = await db.query(sql, [userId, totalAmount, "PLACED"]);
    return result.insertId;
  }
  async createOrderItem(orderId, productId, quantity, price) {
    const sql = `
    insert into order_items(order_id, product_id, quantity, price) values(?,?,?,?)`;
    const [result] = await db.query(sql, [orderId, productId, quantity, price]);

    return result.insertId;
  }
  async getOrdersByUserId(userId) {
    const sql = `select * from orders where user_id=?`;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  }
  async getOrderById(orderId) {
    const sql = "select * from orders where id=?";
    const [rows] = await db.query(sql, [orderId]);
    return rows[0];
  }
  async cancelOrder(orderId) {
    const sql = `update orders set order_status = 'CANCELLED' where id=?`;
    const [result] = await db.query(sql, [orderId]);
    return result.affectedRows;
  }
  async hasPurchasedProduct(customerId, productId) {
    const sql = `
    SELECT oi.id
    FROM orders o
    JOIN order_items oi
        ON o.id = oi.order_id
    WHERE o.user_id = ?
      AND oi.product_id = ?
      AND o.order_status != 'CANCELLED'
    `;

    const [rows] = await db.query(sql, [customerId, productId]);

    return rows.length > 0;
  }
}
module.exports = new CustomerOrderRepository();
