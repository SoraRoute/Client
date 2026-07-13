const customerAddressRepository=require("../Repositories/customerAddressRepository");
const customerRepository=require("../Repositories/customerRepository");

class customerAddressService {
  async createAddress(customerId, customerAddressData){
         const customer = await customerRepository.findCustomerById(customerId);
         if(!customer){
            throw new Error("Customer not found");

         }

        customerAddressData.customer_id = customerId;

const addressId =
    await customerAddressRepository.createAddress(
        customerAddressData
    );

return {
    success: true,
    message: "Address created successfully",
    addressId
};
  }
  async getAddresses(customerId){
    const customer=await customerRepository.findCustomerById(
        customerId
    )
    if(!customer){
        throw new Error ("Customer not found");
    }
    const addresses=await customerAddressRepository.getAddressesByCustomerId(customerId);
    return {
        success:true,
        addresses
    };
  }
  async getAddress(addressId, customerId){
    const customer=await customerRepository.findCustomerById(customerId);
    if(!customer){
        throw new Error("customer not found");}
        const address =await customerAddressRepository.getAddressById(

            addressId
        );
        if(!address){
            throw new Error("Address not found");}
            if(address.customer_id!==customerId){
                throw new Error("Unauthorize access");

            }
            return {
                success:true,
                address
            };
        
    
  }
  async updateAddress(addressId,customerId, customerAddressData){
    const customer=await customerRepository.findCustomerById(customerId);
     if(!customer){
        throw new Error("customer not found");}
        const address=await customerAddressRepository.getAddressById(addressId);
         if(!address){
            throw new Error("Address not found");}
            if(address.customer_id!==customerId){
                    throw new Error("Unauthorized access");
            }
            const rowsUpdated=await customerAddressRepository.updateAddress(
                addressId,customerAddressData
            );
            if(rowsUpdated===0){
                throw new Error("Profile update failed");
            }
            return{
                success:true,
                message:"Address updated successfully"
            };
            

  }
  async deleteAddress(addressId, customerId){
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
        throw new Error("Customer not found");
    }

    const address = await customerAddressRepository.getAddressById(
        addressId
    );

    if (!address) {
        throw new Error("Address not found");
    }
    if(address.customer_id!==customerId){
           throw new Error("Unauthorized access");
    }
   const rowsDeleted=await customerAddressRepository.deleteAddress(addressId);
   if(rowsDeleted===0){
    throw new Error("Address deletion failed");
   }

   return {
    success:true,
    message:"Address deleted successfully"
   };


  }
}
module.exports=new customerAddressService();