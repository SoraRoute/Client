const customerOrderService=require("../Services/CustomerOrderService");

class CustomerOrderController{
    
      async placeOrder(req, res){
        try{
         const result=await customerOrderService.placeOrder(req.customerId);
         return res.status(201).json(result);
      }catch(error){
          return res.status(400).json({
            success:false,
            message:error.message
          });
      }}
      async getOrders(req, res){
        try {
            const result=await customerOrderService.getOrders(req.customerId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:error.message
            });
        }
      }
      async getOrderById(req,res) {
        try {
            const result= await customerOrderService.getOrderById(req.customerId,req.params.orderId);
            return res.status(200).json(result);

            
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }


        
      }
      async cancelOrder(req, res){
       try {
         const result= await customerOrderService.cancelOrder(req.customerId,req.params.orderId);
         return res.status(200).json(result);
        
       } catch (error) {
        return res.status(400).json({
                success:false,
                message:error.message
            })
       }

      }





}
module.exports=new CustomerOrderController();