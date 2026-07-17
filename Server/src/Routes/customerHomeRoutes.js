const express= require("express");
const router=express.Router();
const customerHomeController=require("../controllers/customerHomeController");

router.get("/",
    customerHomeController.getHomePage
)
module.exports=router;