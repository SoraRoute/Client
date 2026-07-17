const customerOrderService = require("../Services/CustomerOrderService");

class CustomerOrderController {
  async placeOrder(req, res) {
    try {
      const result = await customerOrderService.placeOrder(req.user.customerId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getOrders(req, res) {
    try {
      const result = await customerOrderService.getOrders(req.user.customerId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getOrderById(req, res) {
    try {
      const result = await customerOrderService.getOrderById(
        req.user.customerId,
        req.params.orderId,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async cancelOrder(req, res) {
    try {
      const result = await customerOrderService.cancelOrder(
        req.user.customerId,
        req.params.orderId,
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
module.exports = new CustomerOrderController();
