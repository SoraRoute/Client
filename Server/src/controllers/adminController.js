const AdminService = require("../Services/adminService");
const cookieHelper = require("../Utils/cookieHelper");//added this cookie helper import

class AdminController {
  async loginAdmin(req, res) {
    try {
      //change for cookie only this try block
      const result = await AdminService.loginAdmin(req.body);
           
      cookieHelper.setAuthCookie(res, result.token);

      return res.status(200).json({
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAdminProfile(req, res) {
    try {
      const adminId = req.user.adminId;
      const result = await AdminService.getAdminProfile(adminId);

      return res.status(200).json({
        success: true,
        message: "Admin profile fetched successfully.",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async changeAdminPassword(req, res) {
    try {
      const adminId = req.user.adminId;

      const result = await AdminService.changeAdminPassword(adminId, req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async sendAdminOtp(req, res) {
    try {
      const result = await AdminService.sendAdminOtp(req.body.email);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyAdminOtp(req, res) {
    try {
      const result = await AdminService.verifyOtp(
        req.body.email,
        req.body.otp,
        req.body.purpose,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const result = await AdminService.resetPassword(
        req.body.email,
        req.body.otp,
        req.body.newPassword,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  //cookie logout
  async logout(req, res) {
    cookieHelper.clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
}

module.exports = new AdminController();
