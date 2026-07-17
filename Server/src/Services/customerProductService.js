const customerProductRepository=require("../Repositories/customerProductRepository");
class CustomerProductService{
     async     getAllProducts(){
              const products= await customerProductRepository.getAllProducts();
              return {
    success: true,
    products
};
      

     }

async getProductById(productId){
  const product= await customerProductRepository.getProductById(productId);
  if(!product){
    throw new Error("Product not found");
  }
  return {
       success: true,
    product
  }




}

async searchProducts(keyword){
    const products=await customerProductRepository.searchProducts(keyword);
    return{
               success: true,
    products
    }
}

async getProductsByCategory(categoryId) {
    const category= await customerProductRepository.findCategoryById(categoryId);
    if(!category){
        throw new Error("Category not found");
    }
    const products= await customerProductRepository.getProductsByCategory(categoryId);
    return {
           success: true,
    products
    }
}
}

module.exports=new CustomerProductService();