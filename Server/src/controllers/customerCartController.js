const customerCartService = require("../Services/customerCartService");
class CustomerCartController {
  async addToCart(req, res) {
    try {
      const result = await customerCartService.addToCart(
        req.user.customerId,
        req.params.productId,
        req.body.quantity,
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCart(req, res) {
    try {
      const result = await customerCartService.getCart(req.user.customerId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateCartItem(req, res) {
    try {
      const result = await customerCartService.updateCartItem(
        req.user.customerId,
        req.params.productId,
        req.body.quantity,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async removeFromCart(req, res) {
    try {
      const result = await customerCartService.removeFromCart(
        req.user.customerId,
        req.params.productId,
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
module.exports = new CustomerCartController();
