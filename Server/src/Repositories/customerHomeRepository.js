const db = require("../Config/dbConnection");
class CustomerHomeRepository {
  async getCategories() {
    const sql = `SELECT id, name, description
FROM categories

ORDER BY name ASC`;
    const [rows] = await db.query(sql);
    return rows;
  }

  async getFeaturedProducts() {
    const sql = `SELECT
    id,
    category_id,
    title,
    brand,
    price,
    discount_price
FROM products
WHERE status = 'ACTIVE'
LIMIT 8`;
    const [rows] = await db.query(sql);
    return rows;
  }

  async getNewArrivals() {
    const sql = `SELECT
    id,
    category_id,
    title,
    brand,
    price,
    discount_price,
    created_at
FROM products
WHERE status = 'ACTIVE'
ORDER BY created_at DESC
LIMIT 8`;
    const [rows] = await db.query(sql);
    return rows;
  }
}
module.exports = new CustomerHomeRepository();
