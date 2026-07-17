const customerHomeRepository=require("../Repositories/customerHomeRepository");
class CustomerHomeService{
async getHomePage(){
   const categories= await customerHomeRepository.getCategories();
   const featureProducts= await customerHomeRepository.getFeaturedProducts();
   const newArrivals=await customerHomeRepository.getNewArrivals();
   return {
    success:true,
    categories,
    featureProducts,
    newArrivals
   }
}
}
module.exports=new CustomerHomeService();