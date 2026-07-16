const  customerPaymentReporsitory=require("../Repositories/customerPaymentRepository");
const customerRepository=require("../Repositories/customerRepository");
const customerOrderRepository=require("../Repositories/customerOrderRepository");
class CustomerPaymentService{
   async makePayment(customerId,orderId,  paymentMethod){
     const customer=await customerRepository.findCustomerById(customerId);
     if(!customer){
        throw new Error("Customer not found");
     }
     const order= await customerOrderRepository.getOrderById(orderId);
     if(!order){
      throw new Error("Order not found");

     }
     if(order.user_id!==customerId){
             throw new Error("Unauthorized");
     }
     if (order.order_status === "CANCELLED") {
    throw new Error("Cannot pay for a cancelled order");
}
     const payment=await customerPaymentReporsitory.getPaymentByOrderId(orderId);
     if(payment){
      throw new Error("Payment already exists");
     }
     let paymentStatus =
    paymentMethod === "COD" ? "PENDING" : "SUCCESS";

   let transactionId = null;

if (paymentMethod !== "COD") {
    transactionId = "TXN" + Date.now();
}
const paymentId = await customerPaymentReporsitory.createPayment(
    orderId,
    paymentMethod,
    paymentStatus,
    transactionId
);
return {
    success: true,
    message: "Payment successful",
    paymentId
};


   }
   async getPayment(customerId, orderId){
      const customer=await customerRepository.findCustomerById(customerId);
     if(!customer){
        throw new Error("Customer not found");
     }
     const order = await customerOrderRepository.getOrderById(orderId);

if (!order) {
    throw new Error("Order not found");
}
if (order.user_id !== customerId) {
    throw new Error("Unauthorized");
}
     const payment=await customerPaymentReporsitory.getPaymentByOrderId(orderId);
    if (!payment) {
    throw new Error("Payment not found");
}
    
     return{
      success:true,
      payment
     }
   }
}
module.exports=new CustomerPaymentService();