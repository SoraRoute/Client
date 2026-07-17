const customerHomeService=require("../Services/customerHomeService");
class CustomerHomeController{
async getHomePage(req, res){
    try {
        const result=await customerHomeService.getHomePage();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
}
module.exports=new CustomerHomeController();