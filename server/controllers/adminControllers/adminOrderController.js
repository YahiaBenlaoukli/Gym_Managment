import prisma from "../../services/prisma.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS
    }
});

const sendOrderEmail = async (email, subject, title, message, orderId) => {
    try {
        const mailOptions = {
            from: process.env.AUTH_MAIL,
            to: email,
            subject: subject,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #1a1a0a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background-color: #FFD700; padding: 20px; text-align: center; }
                    .header h1 { margin: 0; color: #1a1a0a; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
                    .content { padding: 40px 30px; text-align: center; color: #ffffff; }
                    .message { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 30px; }
                    .info-box { background-color: rgba(255, 215, 0, 0.1); border: 2px solid #FFD700; border-radius: 8px; padding: 20px; display: inline-block; margin-bottom: 30px; }
                    .order-id { font-size: 28px; font-weight: bold; color: #FFD700; letter-spacing: 2px; margin: 0; font-family: 'Courier New', monospace; }
                    .footer { background-color: #111107; padding: 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #333; }
                    .footer p { margin: 5px 0; }
                </style>
            </head>
            <body>
                <div style="padding: 20px;">
                    <div class="container">
                        <div class="header">
                            <h1>Gym Management</h1>
                        </div>
                        <div class="content">
                            <h2 style="color: #FFD700; margin-top: 0;">${title}</h2>
                            <p class="message">
                                ${message}
                            </p>
                            
                            <div class="info-box">
                                <p class="order-id">Order #${orderId}</p>
                            </div>
                            
                            <p class="message" style="font-size: 14px; margin-bottom: 0;">
                                You can track your order status in your dashboard.<br>
                                Thank you for choosing us!
                            </p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Gym Management System. All rights reserved.</p>
                            <p>This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} for Order #${orderId}`);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const rows = await prisma.orders.findMany({
            include: {
                users: true,
                products: true
            },
            orderBy: {
                order_date: 'desc'
            }
        });
        if (rows.length === 0) {
            console.log('No orders');
            return res.status(200).json({ rows: [] });
        }
        return res.status(200).json({ rows })
    } catch (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const getOrderDetails = async (req, res) => {
    const { order_id } = req.query;
    if (!order_id) {
        console.error("Order ID is required");
        return res.status(400).json({ error: "Order ID is required" });
    };
    try {
        const result = await prisma.orders.findUnique({
            where: {
                id: parseInt(order_id)
            },
            include: {
                users: true,
                products: true
            }
        })
        return res.status(200).json({ result });
    } catch (err) {
        console.error("Error fetching order details:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteOrder = async (req, res) => {
    const { order_id } = req.body;
    if (!order_id) {
        console.error("Order ID is required");
        return res.status(400).json({ error: "Order ID is required" });
    }
    try {
        await prisma.orders.delete({
            where: {
                id: parseInt(order_id)
            }
        })
        return res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const orderShipped = async (req, res) => {
    const { order_id } = req.body;
    if (!order_id) {
        console.error("Order ID is required");
        return res.status(400).json({ error: "Order ID is required" });
    };
    try {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: parseInt(order_id)
            },
            data: {
                status: "Shipped"
            },
            include: { users: true }
        });

        if (updatedOrder.users?.email) {
            await sendOrderEmail(
                updatedOrder.users.email,
                "Order Shipped - Gym Management",
                "Your Order is on the way!",
                "Great news! Your order has been shipped and is making its way to you.",
                order_id
            );
        }

        return res.status(200).json({ message: "Order marked as Shipped" });
    } catch (err) {
        console.error("Error updating order status:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const getOrdersByStatus = async (req, res) => {
    const { status } = req.params;
    if (!status) {
        console.error("Status field is required.");
        return res.status(400).json({ error: "Status field is required." });
    }
    try {
        const result = await prisma.orders.findMany({
            where: {
                status: status
            },
            include: {
                users: true,
                products: true
            }
        })
        return res.status(200).json({ result });
    } catch (err) {
        console.error("Error fetching orders by status:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const orderDelivered = async (req, res) => {
    const { order_id } = req.body;
    if (!order_id) {
        console.error("Order ID is required");
        return res.status(400).json({ error: "Order ID is required" });
    };
    try {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: parseInt(order_id)
            },
            data: {
                status: "Delivered"
            },
            include: { users: true }
        });

        if (updatedOrder.users?.email) {
            await sendOrderEmail(
                updatedOrder.users.email,
                "Order Delivered - Gym Management",
                "Your Order has Arrived!",
                "Your order has been successfully delivered. We hope you enjoy your purchase!",
                order_id
            );
        }

        return res.status(200).json({ message: "Order marked as Delivered" });
    } catch (err) {
        console.error("Error updating order status:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const orderCancelled = async (req, res) => {
    const { order_id } = req.body;
    if (!order_id) {
        console.error("Order ID is required");
        return res.status(400).json({ error: "Order ID is required" });
    };
    try {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: parseInt(order_id)
            },
            data: {
                status: "Cancelled"
            },
            include: { users: true }
        });

        if (updatedOrder.users?.email) {
            await sendOrderEmail(
                updatedOrder.users.email,
                "Order Cancelled - Gym Management",
                "Order Cancelled",
                "We wanted to let you know that your order has been cancelled.",
                order_id
            );
        }

        return res.status(200).json({ message: "Order cancelled successfully" });
    } catch (err) {
        console.error("Error cancelling order:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const adminOrderController = {
    getAllOrders,
    deleteOrder,
    orderShipped,
    orderDelivered,
    orderCancelled,
    getOrderDetails,
    getOrdersByStatus
};

export default adminOrderController;
