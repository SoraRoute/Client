const customerReviewService=require("../Services/customerReviewService");

class CustomerReviewController{
    async addReview(req, res){
        try {
            const result= await customerReviewService.addReview(
    req.customerId,
    req.body.productId,
    req.body.rating,
    req.body.comment
);
return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }
    }
    async getReviews(req, res){
        try {
            const result=await customerReviewService.getReviews(
    req.params.productId
);
return res.status(200).json(result);
        } catch (error) {
               return res.status(400).json({
                success:false,
                message:error.message
            })
        }
    }
   async updateReview(req,res){
    try {
               const result= await customerReviewService.updateReview(
    req.customerId,
    req.params.reviewId,
    req.body.rating,
    req.body.comment
);
return res.status(200).json(result)
    } catch (error) {
         return res.status(400).json({
                success:false,
                message:error.message
            })
    }
   
   }
   async deleteReview(req,res){
    try {
        const result= await customerReviewService.deleteReview(
    req.customerId,
    req.params.reviewId
);

return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
                success:false,
                message:error.message
            })
    }
   }
}
module.exports=new CustomerReviewController();