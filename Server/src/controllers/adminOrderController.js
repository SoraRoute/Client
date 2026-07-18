const adminOrderService = require("../Services/adminOrderService");

class AdminOrderController {

    async getAllOrders(req, res) {
        try {

            const result = await adminOrderService.getAllOrders();

            return res.status(200).json(result);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async getOrderById(req, res) {
        try {

            const { orderId } = req.params;

            const result = await adminOrderService.getOrderById(orderId);

            return res.status(200).json(result);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async updateOrderStatus(req, res) {
        try {

            const { orderId } = req.params;
            const { order_status } = req.body;

            const result = await adminOrderService.updateOrderStatus(
                orderId,
                order_status
            );

            return res.status(200).json(result);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }
}

module.exports = new AdminOrderController();