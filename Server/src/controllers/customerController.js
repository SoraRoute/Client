const customerService = require("../Services/customerService");
const cookieHelper = require("../Utils/cookieHelper");

class CustomerController {
  async registerCustomer(req, res) {
    try {
      const result = await customerService.registerCustomer(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async verifyEmail(req, res) {
    try {
      const customerData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        role: "customer",
      };
      const result = await customerService.verifyEmail(
        customerData,
        req.body.otp,
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async loginCustomer(req, res) {
    try {
      const result = await customerService.loginCustomer(req.body);
      cookieHelper.setAuthCookie(res, result.token);
      return res.status(200).json({
        success: true,
        message: result.message,
        customer: result.customer,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        messasge: error.message,
      });
    }
  }
  async forgotPassword(req, res) {
    try {
      const result = await customerService.forgotPassword(req.body.email);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async resetPassword(req, res) {
    try {
      const result = await customerService.resetPassword(
        req.body.email,
        req.body.otp,
        req.body.newPassword,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCustomerProfile(req, res) {
    try {
      const result = await customerService.getCustomerProfile(req.customerId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateCustomerProfile(req, res) {
    try {
      const result = await customerService.updateCustomerProfile(
        req.customerId,
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
  async logout(req, res) {
    cookieHelper.clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
}
module.exports = new CustomerController();
