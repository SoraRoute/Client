const jwtProvider=require("../Utils/jwtProvider");
function authenticateCustomer(req,res,next){
    try{
        const authHeader=req.headers.authorization;
     
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Authorization token missing"
            });}
            const token = authHeader.split(" ")[1];
            const decoded=jwtProvider.verifyToken(token);
            req.customerId=decoded.customerId;
            next();
            
    }catch(error){
        return res.status(401).json({
                success: false,
            message: error.message
        })
    }
}
module.exports=authenticateCustomer;