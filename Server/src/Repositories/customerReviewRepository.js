const db = require("../Config/dbConnection");
class CustomerReviewRepository {
  async addReview(userId, productId, rating, comment) {
    const sql = `
    insert into reviews(user_id,product_id, rating, comment) values(?,?,?,?) `;
    const [result] = await db.query(sql, [userId, productId, rating, comment]);
    return result.insertId;
  }
  async getReviewByUserAndProduct(userId, productId) {
    const sql = `
    select * from reviews where user_id=? and product_id=?`;
    const [result] = await db.query(sql, [userId, productId]);
    return result[0];
  }
  async getReviewsByProductId(productId) {
    const sql = `
    select * from reviews where product_id=?`;
    const [result] = await db.query(sql, [productId]);
    return result;
  }
  async getReviewById(reviewId) {
    const sql = `
    select * from reviews where id=?`;
    const [result] = await db.query(sql, [reviewId]);
    return result[0];
  }
  async updateReview(reviewId, rating, comment) {
    const sql = `update reviews set rating=? , comment=? where id=?`;
    const [result] = await db.query(sql, [rating, comment, reviewId]);
    return result.affectedRows;
  }
  async deleteReview(reviewId) {
    const sql = `delete from reviews  where id=?`;

    const [result] = await db.query(sql, [reviewId]);
    return result.affectedRows;
  }
}
module.exports = new CustomerReviewRepository();
