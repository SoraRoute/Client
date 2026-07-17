const db = require("../Config/dbConnection");
class aiRepository {
  async getProductsForAI() {
    const sql = `SELECT
    p.id,
    p.title,
    p.brand,
    c.name AS category,
    p.description,
    p.price,
    p.discount_price
FROM products p
LEFT JOIN categories c
ON p.category_id = c.id
WHERE p.status = 'ACTIVE'`;
    const [rows] = await db.query(sql);
    return rows;
  }
}
module.exports = new aiRepository();
