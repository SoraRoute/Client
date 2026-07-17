const express=require("express");
const router=express.Router();


const customerProductController=require("../controllers/customerProductController");

router.get("/",
    customerProductController.getAllProducts
);
router.get("/search",
    customerProductController.searchProducts
);
router.get("/category/:categoryId",
    customerProductController.getProductsByCategory
);
router.get("/:productId",
    customerProductController.getProductById
)


module.exports=router;