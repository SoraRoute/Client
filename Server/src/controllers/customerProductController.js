const customerProductService = require("../Services/customerProductService");

class CustomerProductController {
  async getAllProducts(req, res) {
    try {
      const getProducts = await customerProductService.getAllProducts();
      return res.status(200).json(getProducts);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await customerProductService.getProductById(
        req.params.productId,
      );
      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async searchProducts(req, res) {
    try {
      const products = await customerProductService.searchProducts(
        req.query.keyword,
      );
      return res.status(200).json(products);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const product = await customerProductService.getProductsByCategory(
        req.params.categoryId,
      );
      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new CustomerProductController();
