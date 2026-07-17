const db = require("../Config/dbConnection");
class CustomerPaymentRepository {
  async createPayment(orderId, paymentMethod, paymentStatus, transactionId) {
    const sql = `
    insert into payments (order_id, payment_method, payment_status,transaction_id) values(?,?,?,?)`;
    const [result] = await db.query(sql, [
      orderId,
      paymentMethod,
      paymentStatus,
      transactionId,
    ]);
    return result.insertId;
  }
  async getPaymentByOrderId(orderId) {
    const sql = `
    select * from payments where order_id=?`;
    const [rows] = await db.query(sql, [orderId]);
    return rows[0];
  }
  async updatePaymentStatus(orderId, paymentStatus, transactionId) {
    const sql = `
    update payments SET payment_status = ?, transaction_id = ? where order_id=?`;
    const [rows] = await db.query(sql, [paymentStatus, transactionId, orderId]);
    return rows.affectedRows;
  }
}
module.exports = new CustomerPaymentRepository();
