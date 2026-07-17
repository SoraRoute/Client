const db = require("../Config/dbConnection");
class CustomerProductRepository {
  async getAllProducts() {
    const sql = `select *from products where status="ACTIVE"`;
    const [result] = await db.query(sql);
    return result;
  }
  async getProductById(productId) {
    const sql = `
            SELECT *
            FROM products
          WHERE id = ? AND status = 'ACTIVE'
            LIMIT 1
        `;

    const [rows] = await db.query(sql, [productId]);

    return rows[0];
  }

  async searchProducts(keyword) {
    const sql = `
        SELECT *
        FROM products
        WHERE title LIKE ?
        AND status = "ACTIVE"
    `;

    const [rows] = await db.query(sql, [`%${keyword}%`]);

    return rows;
  }

  async getProductsByCategory(categoryId) {
    const sql = `
        SELECT *
        FROM products
        WHERE category_id = ?
        AND status = "ACTIVE"
    `;

    const [rows] = await db.query(sql, [categoryId]);

    return rows;
  }
  async findCategoryById(categoryId) {
    const sql = `
        SELECT *
        FROM categories
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] = await db.query(sql, [categoryId]);

    return rows[0];
  }
}
module.exports = new CustomerProductRepository();
