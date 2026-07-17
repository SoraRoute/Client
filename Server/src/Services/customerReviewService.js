const customerReviewRepository = require("../Repositories/customerReviewRepository");
const customerRepository = require("../Repositories/customerRepository");
const customerOrderRepository = require("../Repositories/customerOrderRepository");
const productRepository = require("../Repositories/productRepository");
class CustomerReviwService {
  async addReview(customerId, productId, rating, comment) {
    const customer = await customerRepository.findCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const product = await productRepository.findProductById(productId);
    if (!product) {
      throw new Error("product not found");
    }
    const purchased = await customerOrderRepository.hasPurchasedProduct(
      customerId,
      productId,
    );

    if (!purchased) {
      throw new Error("You can review only purchased products");
    }
    const existingReview =
      await customerReviewRepository.getReviewByUserAndProduct(
        customerId,
        productId,
      );

    if (existingReview) {
      throw new Error("Review already exists");
    }
    const reviewId = await customerReviewRepository.addReview(
      customerId,
      productId,
      rating,
      comment,
    );
    return {
      success: true,
      message: "Review added successfully",
      reviewId,
    };
  }
  async getReviews(productId) {
    const product = await productRepository.findProductById(productId);
    if (!product) {
      throw new Error("product not found");
    }
    const reviews =
      await customerReviewRepository.getReviewsByProductId(productId);
    return {
      success: true,
      reviews,
    };
  }
  async updateReview(customerId, reviewId, rating, comment) {
    const customer = await customerRepository.findCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const review = await customerReviewRepository.getReviewById(reviewId);
    if (!review) {
      throw new Error("No review found");
    }
    if (review.user_id !== customerId) {
      throw new Error("Unauthorized");
    }
    await customerReviewRepository.updateReview(reviewId, rating, comment);
    return {
      success: true,
      message: "Review updated successfully",
    };
  }
  async deleteReview(customerId, reviewId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const review = await customerReviewRepository.getReviewById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    await customerReviewRepository.deleteReview(reviewId);

    return {
      success: true,
      message: "Review deleted successfully",
    };
  }
}
module.exports = new CustomerReviwService();
