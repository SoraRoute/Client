const db= require("../config/dbConnection");
class CustomerAddressRepository{
    async createAddress(customerAddressData){
        const sql=`
        insert into customer_addresses
        (customer_id, address_line1, address_line2,city, state, pincode, country, address_type)
        values(?,?,?,?,?,?,?,?)`;
        const [result]=await db.query(sql, [
            customerAddressData.customer_id,
            customerAddressData.address_line1,
            customerAddressData.address_line2,
            customerAddressData.city,
            customerAddressData.state,
            customerAddressData.pincode,
            customerAddressData.country,
            customerAddressData.address_type
        ]);
         return result.insertId;
    }
    async getAddressesByCustomerId(customerId){
        const sql=`
        select * from customer_addresses where customer_id=? `;
        const [rows]=await db.query(sql, [customerId]);
        return rows
    }
    async getAddressById(addressId){
        const sql=`
        select * from
        customer_addresses
        where id=?
        limit 1`;
        const [rows]= await db.query(sql,[addressId]);
        return rows[0];
    }

   async updateAddress(addressId, customerAddressData){
    const sql=`
    update customer_addresses
    set 
    address_line1=?,
    address_line2=?,
    city=?,
    state=?,
    pincode=?,
    country=?,
    address_type=?
    where id=?`;
    const [result]=await db.query(sql, [
                    customerAddressData.address_line1,
            customerAddressData.address_line2,
            customerAddressData.city,
            customerAddressData.state,
            customerAddressData.pincode,
            customerAddressData.country,
            customerAddressData.address_type,
            addressId
    ]);
    return result.affectedRows;


   }
   async deleteAddress(addressId){

     const sql=`
     delete from customer_addresses
     where id=?`;
     const [result]=await db.query(sql, [addressId]);
     return result.affectedRows;

   }
   async setDefaultAddress(){

   }


}
module.exports = new CustomerAddressRepository();