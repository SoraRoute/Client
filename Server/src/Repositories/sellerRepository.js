class SellerRepository{

    async saveOtp(connection,email,otpHash,purpose,expires_at){
        await connection.query(`
            Insert Into verification_codes("
                email,
                otp_hash,
                purpose,
                expires_at) 
                values (?,?,?,?)`,[email,otpHash,purpose,expires_at]          
        );
    }

    async findSellerByEmail(connection,email){
        const [rows] = await connection.query(
            "Select * from sellers where email = ?",[email]
        );
        return rows[0];
    }

    async findOtpByEmail(connection,email,purpose){
        const [rows] = await connection.query(`
                Select * from verification_codes where email = ? and purpose = ?`,
                [email,purpose]
            );

        return rows[0];
    }

    async deleteOtp(connection,email,purpose){
        await connection.query(`
            Delete from verification_codes where email = ? and purpose = ?`,
            [email,purpose]
        );
    }

    async createSeller(connection,seller){
        const[result] = await connection.query(
            `Insert Into sellers(
                seller_name,
                email,
                mobile,
                passwordd,gstin) 
                Values (?,?,?,?,?)`,
                [
                    seller.seller_name,
                    seller.email,
                    seller.mobile,
                    seller.passwordd,
                    seller.gstin
                ]
        );

        return result.insertId;
    }

    async createAddress(connection, sellerId,address) {

        await connection.query(
            `INSERT INTO addresses
            (
                seller_id,
                address_line1,
                address_line2,
                city,
                state,
                pincode,
                country
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                sellerId,
                address.address_line1,
                address.address_line2,
                address.city,
                address.state,
                address.pincode,
                address.country
            ]
        );

    }

    async createBusinessDetails(connection, sellerId, business) {

        await connection.query(
            `INSERT INTO business_details
            (
                seller_id,
                business_name,
                business_email,
                business_mobile,
                business_type,
                business_address,
                pan_number
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                sellerId,
                business.business_name,
                business.business_email,
                business.business_mobile,
                business.business_type,
                business.business_address,
                business.pan_number
            ]
        );
    }

    async createBankDetails(connection, sellerId, bank) {

        await connection.query(
            `INSERT INTO bank_details
            (
                seller_id,
                account_holder_name,
                account_number,
                bank_name,
                ifsc_code
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                sellerId,
                bank.account_holder_name,
                bank.account_number,
                bank.bank_name,
                bank.ifsc_code
            ]
        );
    }

    async getSellerById(connection,id){
        const [rows] = await connection.query(
                "SELECT id,seller_name,email,mobile FROM sellers WHERE id = ?",
                [id]
        );

        return rows[0];
    }

    async updateSellerPassword(connection,email,hashedPassword){
        await connection.query(
            "update sellers set passwordd = ? where email = ?",
            [hashedPassword,email]
        );
    }

    async updateSellerProfile(connection,sellerId,sellerData){
        const query = `
        UPDATE sellers
        SET
            seller_name = ?,
            mobile = ?,
            gstin = ?
        WHERE id = ?;
    `;

    const [result] = await connection.execute(query, [
        sellerData.sellerName,
        sellerData.mobile,
        sellerData.gstin,
        sellerId
    ]);

    return result;

    }

    async checkSellerExists(connection, mobile, gstin, sellerId){
        const query = `
            SELECT id
            FROM sellers
            WHERE (mobile = ? OR gstin = ?)
            AND id != ?;
        `;

        const [rows] = await connection.execute(query, [
            mobile,
            gstin,
            sellerId
        ]);

        return rows[0];
    }

    async updatePassword(connection, sellerId, hashedPassword){
        const query = `
            UPDATE sellers
            SET passwordd = ?
            WHERE id = ?;
        `;

        const [result] = await connection.execute(query, [
            hashedPassword,
            sellerId
        ]);

        return result;
    }

    async getSellerPassword(connection, sellerId){
        const query = `
            SELECT passwordd
            FROM sellers
            WHERE id = ?;
        `;

        const [rows] = await connection.execute(query, [sellerId]);

        return rows[0];

    }

    async getSellerOrders(connection, sellerId){
        const query = `
            SELECT
                oi.id AS order_item_id,
                o.id AS order_id,
                p.id AS product_id,
                p.title,
                oi.quantity,
                oi.price,
                (oi.quantity * oi.price) AS total_price,
                o.order_status,
                o.created_at
            FROM order_items oi
            INNER JOIN orders o
                ON oi.order_id = o.id
            INNER JOIN products p
                ON oi.product_id = p.id
            WHERE p.seller_id = ?
            ORDER BY o.created_at DESC;
        `;

        const [rows] = await connection.query(query, [sellerId]);

        return rows;
    }

    async getSellerRevenue(connection, sellerId){
        const query = `
            SELECT
                COALESCE(SUM(oi.quantity * oi.price), 0) AS totalRevenue
            FROM order_items oi
            INNER JOIN orders o
                ON oi.order_id = o.id
            INNER JOIN products p
                ON oi.product_id = p.id
            WHERE p.seller_id = ?
            AND o.order_status = 'DELIVERED';
        `;

        const [rows] = await connection.query(query, [sellerId]);

        return rows[0];
    }

    async getOrderById(connection, orderId, sellerId){
        const query = `
            SELECT
                o.id,
                o.order_status
            FROM orders o
            INNER JOIN order_items oi
                ON o.id = oi.order_id
            INNER JOIN products p
                ON oi.product_id = p.id
            WHERE o.id = ?
            AND p.seller_id = ?;
        `;

        const [rows] = await connection.query(query, [
            orderId,
            sellerId
        ]);

        return rows[0];
    }

    async updateOrderStatus(connection, orderId, orderStatus){
        const query = `
            UPDATE orders
            SET order_status = ?
            WHERE id = ?;
        `;

        const [result] = await connection.query(query, [
            orderStatus,
            orderId
        ]);

        return result;
    }


}

module.exports = new SellerRepository();
