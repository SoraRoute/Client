const express = require("express");
const router = express.Router();

const customerAddressController = require("../controllers/customerAddressContoller");
const authenticateCustomer = require("../middleware/authMiddleware");
router.post("/", authenticateCustomer, customerAddressController.createAddress);

router.get("/", authenticateCustomer, customerAddressController.getAddresses);

router.get("/:id", authenticateCustomer, customerAddressController.getAddress);

router.patch(
  "/:id",
  authenticateCustomer,
  customerAddressController.updateAddress,
);

router.delete(
  "/:id",
  authenticateCustomer,
  customerAddressController.deleteAddress,
);
module.exports = router;
