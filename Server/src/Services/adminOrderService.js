const db = require("../Config/dbConnection");
const adminOrderRepository = require("../Repositories/adminOrderReopsitory");

class AdminOrderService {

    async getAllOrders() {
        const connection = await db.getConnection();

        try {

            const orders = await adminOrderRepository.getAllOrders(connection);

            return {
                success: true,
                data: orders,
                message: "Orders fetched successfully."
            };

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    async getOrderById(orderId) {
        const connection = await db.getConnection();

        try {

            const order = await adminOrderRepository.getOrderById(
                connection,
                orderId
            );

            if (order.length === 0) {
                throw new Error("Order not found.");
            }

            return {
                success: true,
                data: order,
                message: "Order fetched successfully."
            };

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    async updateOrderStatus(orderId, orderStatus) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const allowedStatus = [
                "PLACED",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ];

            if (!allowedStatus.includes(orderStatus)) {
                throw new Error("Invalid order status.");
            }

            const existingOrder = await adminOrderRepository.getOrderById(
                connection,
                orderId
            );

            if (existingOrder.length === 0) {
                throw new Error("Order not found.");
            }

            const result = await adminOrderRepository.updateOrderStatus(
                connection,
                orderId,
                orderStatus
            );

            if (result.affectedRows === 0) {
                throw new Error("Failed to update order status.");
            }

            await connection.commit();

            return {
                success: true,
                message: "Order status updated successfully."
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }
}

module.exports = new AdminOrderService();