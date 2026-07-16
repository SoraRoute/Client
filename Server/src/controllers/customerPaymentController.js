const customerPaymentService=require("../Services/customerPaymentService");

class CustomerPaymentController{
   async makePayment(req,res){
    try {
        const result = await customerPaymentService.makePayment(
            req.customerId,
            req.body.orderId,
            req.body.paymentMethod
        );
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
   }
   async getPayment(req,res){
    try {
        const result=await customerPaymentService.getPayment(req.customerId,
            req.params.orderId
        );
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
   }




}
module.exports=new CustomerPaymentController();