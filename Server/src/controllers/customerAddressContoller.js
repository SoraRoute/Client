const customerAddressService = require("../Services/customerAddressService");

class customerAddressController {
  async createAddress(req, res) {
    try {
      const result = await customerAddressService.createAddress(
        req.user.customerId,
        req.body,
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getAddresses(req, res) {
    try {
      const result = await customerAddressService.getAddresses(
        req.user.customerId,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getAddress(req, res) {
    try {
      const result = await customerAddressService.getAddress(
        req.params.id,
        req.user.customerId,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateAddress(req, res) {
    try {
      const result = await customerAddressService.updateAddress(
        req.params.id,
        req.user.customerId,
        req.body,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async deleteAddress(req, res) {
    try {
      const result = await customerAddressService.deleteAddress(
        req.params.id,
        req.user.customerId,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new customerAddressController();
