const db = require("../Config/dbConnection");

class ProductRepository{

    async createProduct(connection,productData){
        const query = `
        Insert Into products(
            seller_id,
            category_id,
            title,
            description,
            brand,
            price,
            discount_price,
            status
        )
        Values (?,?,?,?,?,?,?,?)`;

        const values = [
            productData.seller_id,
            productData.category_id,
            productData.title,
            productData.description,
            productData.brand,
            productData.price,
            productData.discount_price,
            productData.status || "ACTIVE"
        ]

        const [result] = await connection.query(query,values);

        return result.insertId;
    }

    async addProductImages(connection,productId,images){
        const query = `
        Insert Into product_images(
            product_id,
            image_url,
            public_id
        )
        Values (?,?,?)`;

        for(const image of images){
            await connection.query(query,[
                productId,
                image.image_url,
                image.public_id
            ]);
        }

    }
}

module.exports = new ProductRepository();