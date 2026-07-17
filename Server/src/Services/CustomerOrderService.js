const customerOrderRepository = require("../Repositories/customerOrderRepository");
const customerRepository = require("../Repositories/customerRepository");
const customerCartRepository = require("../Repositories/customercartRepository");
class CustomerOrderService {
  async placeOrder(customerId) {
    const customer = await customerRepository.findCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const cart = await customerCartRepository.getCartByUserId(customerId);
    if (!cart) {
      throw new Error("Cart is empty");
    }
    const cartProducts = await customerCartRepository.getCartProducts(cart.id);
    if (cartProducts.length === 0) {
      throw new Error("Cart is empty");
    }
    let totalAmount = 0;
    for (const item of cartProducts) {
      totalAmount += item.price * item.quantity;
    }
    const orderId = await customerOrderRepository.createOrder(
      customerId,
      totalAmount,
    );
    for (const item of cartProducts) {
      await customerOrderRepository.createOrderItem(
        orderId,
        item.id,
        item.quantity,
        item.price,
      );
    }
    await customerCartRepository.clearCart(cart.id);
    return {
      success: true,
      message: "Order placed successfully",
      orderId,
    };
  }

  async getOrders(customerId) {
    const customer = await customerRepository.findCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const orders = await customerOrderRepository.getOrdersByUserId(customerId);

    return {
      success: true,
      orders,
    };
  }
  async getOrderById(customerId, orderId) {
    const customer = await customerRepository.findCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const orders = await customerOrderRepository.getOrderById(orderId);
    if (!orders) {
      throw new Error("Order not found");
    }
    if (orders.user_id !== customerId) {
      throw new Error("Unauthorized");
    }
    return {
      success: true,
      orders,
    };
  }
  async cancelOrder(customerId, orderId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const order = await customerOrderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    if (order.order_status === "CANCELLED") {
      throw new Error("Order already cancelled");
    }

    const rowsUpdated = await customerOrderRepository.cancelOrder(orderId);

    if (rowsUpdated === 0) {
      throw new Error("Failed to cancel order");
    }

    return {
      success: true,
      message: "Order cancelled successfully",
    };
  }
}
module.exports = new CustomerOrderService();
