const db=require("../Config/dbConnection");
class CustomerWishlistRepository{
    async createWishlist(userId){
        const sql =`
        insert into wishlists(user_id)
        values(?)
        
        `;
        const [result]=await db.query(sql,[userId]);
        return result.insertId;

    }
    async getWishlistByUserId(userId) {
        const sql=`
        select * from wishlists where user_id=?
        limit 1`;
        const [rows]=await db.query(sql, [userId]);
        return rows[0];
    }
 async findWishlistItem(wishlistId, productId) {
    const sql=`
    select * from wishlist_items
    where wishlist_id=?
    and product_id=?
    limit 1`;
    const [rows]=await db.query(sql,[wishlistId,productId]);
    return rows[0];



 }
 async addProductToWishlist(wishlistId, productId){
    const sql=`
    insert into wishlist_items
    (wishlist_id, product_id) values(?,?)`;
    const [result]=await db.query(sql, [
        wishlistId,productId
    ]);
    return result.insertId;
 }
async getWishlistProducts(wishlistId) {

    const sql = `
    SELECT
        p.id,
        p.title,
        p.description,
        p.brand,
        p.price,
        p.discount_price,
        p.status
    FROM wishlist_items wi
    JOIN products p
        ON wi.product_id = p.id
    WHERE wi.wishlist_id = ?
    `;

    const [rows] = await db.query(sql, [wishlistId]);

    return rows;
}

 async removeProductFromWishlist(wishlistId, productId){
    const sql=`
    delete from wishlist_items
    where wishlist_id=?
    and product_id=?`;
    const [result]=await db.query(sql,[
        wishlistId,productId
    ]);
    return result.affectedRows;
 }

}
module.exports=new CustomerWishlistRepository();