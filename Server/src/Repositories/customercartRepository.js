const db= require("../Config/dbConnection");
class CustomerCartRepository {
    async createCart(userId){
        const sql=`
        INSERT INTO carts (user_id ) values (?)`;
        const [result]=await db.query(sql,[userId]);
        return result.insertId;

    }
    async addProductToCart(cartId, productId, quantity){
        const sql=`
        insert into cart_items
        (cart_id, product_id, quantity) values (?,?,?)`;
        const [result]=await db.query(sql,[cartId, productId, quantity]);
        return result.insertId;
    }
    async getCartByUserId(userId){
        const sql=`
        select * from carts where user_id=?
        limit 1`;
        const [rows]=await db.query(sql,[userId]);
        return rows[0];
    }
    async findCartItem(cartId, productId){
        const sql=`
        select * from cart_items where cart_id=? and product_id=? limit 1`;
        const [rows]=await db.query(sql,[cartId,productId]);
        return rows[0];
    }
    async getCartProducts(cartId){
        const sql = `
    SELECT
        p.id,
        p.title,
        p.description,
        p.brand,
        p.price,
        p.discount_price,
        p.status,
        ci.quantity
    FROM cart_items ci
    JOIN products p
        ON ci.product_id = p.id
    WHERE ci.cart_id = ?
    `;
        const [rows]=await db.query(sql,[cartId]);
        return rows;
    }
    async updateCartItemQuantity(cartId, productId,quantity){
        const sql=`
        update cart_items
        set quantity=?
        where cart_id=?
        and product_id=?`;
        const [result]=await db.query(sql,[
          quantity,  cartId,productId
        ])
        return result.affectedRows;
    }

    async removeProductFromCart(cartId, productId){
        const sql=`
        delete from cart_items where cart_id=? and product_id=?`;
        const [result]=await db.query(sql,[cartId,productId]);
        return result.affectedRows;
       
    }
     async clearCart(cartId) {
    const sql = `
    DELETE FROM cart_items
    WHERE cart_id = ?
    `;

    const [result] = await db.query(sql, [cartId]);

    return result.affectedRows;
}

}
module.exports=new CustomerCartRepository();