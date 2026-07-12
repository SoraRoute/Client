const customerService=require("../Services/customerService");
class CustomerController{
 async registerCustomer(req,res){
    try{
        const result=await customerService.registerCustomer(
            req.body
        );
        return res.status(200).json(result);

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
 }
 async verifyEmail(req,res){
    try{
        const customerData={
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    email:req.body.email,
    mobile:req.body.mobile,
    password:req.body.password,
    role:"customer"

 };
const result= await customerService.verifyEmail(
    customerData,
    req.body.otp
);
return res.status(201).json(result);
}catch(error){
    return res.status(400).json({
        success:false,
        message:error.message
    });
}

}
async loginCustomer(req,res){
    try{
        const result=await customerService.loginCustomer(req.body);
        return res.status(200).json(result);
    }
    catch(error){
        return res.status(400).json({
            success:false,
            messasge:error.message
        });
    }
}}
module.exports=new CustomerController();