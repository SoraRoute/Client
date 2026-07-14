const express=require("express");

const router=express.Router();
const customerWishlistController=require("../controllers/customerWishlistController");
const authenticateCustomer = require("../middleware/customerAuthMiddleware");


router.post(
    "/:productId",
    authenticateCustomer,
    customerWishlistController.addToWishlist
);
router.get(
    "/",
    authenticateCustomer,
    customerWishlistController.getWishlist
);
router.delete(
    "/:productId",
    authenticateCustomer,
    customerWishlistController.removeFromWishlist

)
module.exports=router;