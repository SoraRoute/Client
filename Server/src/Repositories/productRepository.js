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

    async getSellerProducts(connection,sellerId){
        const query = `Select
            id,
            category_id,
            title,
            description,
            brand,
            price,
            discount_price,
            stock,
            status,
            created_at
        From products where seller_id = ?
        Order by created_at Desc
        `;

        const [rows] = await connection.query(query,[sellerId]);

        return rows;
    }

    async getProductById(connection,productId,sellerId){
        const query = `Select * from products where id = ? and seller_id = ?
        `;

        const [rows] = await connection.query(query,[productId,sellerId]);

        return rows[0];
    }

    async getProductImages(connection,productId){
        const query = `Select
            id,
            image_url,
            public_id
        from product_images
        where product_id = ? 
        `;

        const [images] = await connection.query(query,[productId]);

        return images;
    }
}

module.exports = new ProductRepository();