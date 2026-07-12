const db=require("../config/dbConnection");
class CustomerRepository{
    async createCustomer(customerData){
        const sql=`
        INSERT INTO users 
        (first_name, last_name, email, mobile, password,role)
        values(?,?,?,?,?,?)`;
        const [result]=await db.query(sql,[
            customerData.first_name,
            customerData.last_name,
            customerData.email,
            customerData.mobile,
            customerData.password,
            customerData.role || "customer"
        ]);
        return result.insertId;
    }
    async findCustomerByEmail(email){
        const sql=`
        SELECT * FROM users
        WHERE email=?
        LIMIT 1`;

        const [rows]=await db.query(sql,[email]);
        return rows[0];
    }
    async findCustomerById(id){
        const sql=`SELECT * FROM users WHERE id=?
        LIMIT 1`;
        const [rows]=await db.query(sql, [id]);
        return rows[0];
    }
    async updatePassword(email, hashedPassword){
        const sql=` UPDATE users
        SET password=?
        WHERE email=?`;
       const [result]=await db.query(sql,[
        hashedPassword, email
       ]);
       return result.affectedRows;
    }
    async updateCustomerProfile(customerId, customerData){
        const sql=`
        UPDATE users
        SET 
        first_name=?,
        last_name=?,
        mobile=?
        where id=?`;
        const [result]=await db.query(sql,[
            customerData.first_name,
            customerData.last_name,
            customerData.mobile,
            customerId
        ]);
        return result.affectedRows;
    }
}
module.exports=new CustomerRepository();