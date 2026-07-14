const customerWishlistRepository = require("../Repositories/customerWishlistRepository")
const customerRepository = require("../Repositories/customerRepository");

class CustomerWishlistService{
    async addToWishlist(customerId, productId){
        const customer=await customerRepository.findCustomerById(customerId);
        if (!customer) {
        throw new Error("Customer not found");
    }
    let wishlist=await customerWishlistRepository.getWishlistByUserId(
        customerId
    );
    if(!wishlist){
        const wishlistId= await customerWishlistRepository.createWishlist(
            customerId
        );
        wishlist={
            id:wishlistId
        };


    }
    const existingItem=await customerWishlistRepository.findWishlistItem(
        wishlist.id,
        productId
    );
    if(existingItem){
        throw new Error("Product already exists in wishlist");
    }
    try {
        const wishlistItemId=await customerWishlistRepository.addProductToWishlist(
            wishlist.id,
            productId
        );

    return {
        success: true,
        message: "Product added to wishlist",
        wishlistItemId
    };
    } catch (error) {
        if(error.code==="ER_NO_REFERENCED_ROW_2"){
            throw new Error("Product not found")
        }
        throw error;
        
    }


    }
    async getWishlist(customerId) {
        const customer=await customerRepository.findCustomerById(customerId);
        if(!customer){
            throw new Error("Customer now found");

        }
        const wishlist=await customerWishlistRepository.getWishlistByUserId(
            customerId
        );
        if(!wishlist){
            return {
                success:true,
                wishlist:[]
            };
        }
        const wishlistProducts=await customerWishlistRepository.getWishlistProducts(
            wishlist.id
        );
        return{
            success:true,
            wishlist:wishlistProducts
        };;
    }
    async removeFromWishlist(customerId, productId) {
    const customer=await customerRepository.findCustomerById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
    }
    const wishlist = await customerWishlistRepository.getWishlistByUserId(customerId);
      if (!wishlist) {
        throw new Error("Wishlist not found");
    }
    const existingItem=await customerWishlistRepository.findWishlistItem(wishlist.id,productId);
        if (!existingItem) {
        throw new Error("Product not found in wishlist");
    }

    const rowsDeleted=await customerWishlistRepository.removeProductFromWishlist(wishlist.id, productId);
    if(rowsDeleted===0){
                throw new Error("Failed to remove product from wishlist");

    }
    return{
        success:true,
        message:"Product removed from wishlist"
    };
    
    
    
    }

}
module.exports=new CustomerWishlistService();