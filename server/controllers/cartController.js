import getConnection from '../services/db.js';
import prisma from "../services/prisma.js";


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS
    }
});

export const addToCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        /*const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const cartItem = { user_id, product_id, quantity, created_at };
        const [result] = await connection.promise().query("INSERT INTO cart SET ?", cartItem);?*/
        const result = await prisma.cart.create({
            data: {
                user_id: parseInt(user_id),
                product_id: parseInt(product_id),
                quantity: parseInt(quantity),
            }
        })
        console.log("Item added to cart with ID:", result.id);
        return res.status(201).json({ message: "Item added to cart.", cartItemId: result.id });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

export const viewCart = async (req, res) => {
    const user_id = req.user.id;

    if (!user_id) {
        console.error("Validation error: Missing user_id field.");
        return res.status(400).json({ error: "user_id field is required." });
    }
    try {
        /*const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [cartItems] = await connection.promise().query(
            `SELECT c.id AS cartItemId, c.quantity, p.id AS productId, p.name, p.category, p.description, p.current_price, p.old_price, p.image_path, c.quantity
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [user_id]
        );*/
        const cartItems = await prisma.$queryRaw`
            SELECT c.id AS cartItemId, c.quantity, p.id AS productId, p.name, p.category, p.description, p.current_price, p.old_price, p.image_path, c.quantity
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ${user_id}
        `
        return res.status(200).json(cartItems);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const removeFromCart = async (req, res) => {
    const { cartItemId } = req.body;
    if (!cartItemId) {
        console.error("Validation error: Missing cartItemId field.");
        return res.status(400).json({ error: "cartItemId field is required." });
    }
    try {
        /*const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [result] = await connection.promise().query(
            "DELETE FROM cart WHERE id = ?",
            [cartItemId]
        );*/
        const result = await prisma.cart.delete({
            where: {
                id: parseInt(cartItemId)
            }
        })
        console.log("Item removed from cart with ID:", cartItemId);
        return res.status(200).json({ message: "Item removed from cart." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const confirmedOrder = async (req, res) => {
    const { cartItemId, userLocation, userMobile } = req.body;
    const user_id = req.user.id;
    const user_email = req.user.email;
    if (!cartItemId || !userLocation || !userMobile) {
        return res.status(400).json({ error: "All fields are required." });
    }

    let connection;

    try {
        /*connection = await getConnection();
        console.log("Connected to the database.");
        const [cartItems] = await connection.promise().query(
            "SELECT * FROM cart WHERE id = ? AND user_id = ?",
            [cartItemId, user_id]
        );*/
        const cartItems = await prisma.cart.findMany({
            where: {
                id: parseInt(cartItemId),
                user_id: parseInt(user_id)
            }
        });

        if (cartItems.length === 0) {
            return res.status(404).json({ error: "Cart item not found." });
        }

        /*const { product_id, quantity } = cartItems[0];
        await connection.promise().query(
            "UPDATE products SET stock = stock - ? WHERE id = ?",
            [quantity, product_id]
        );
        const [result] = await connection.promise().query(
            `INSERT INTO orders (user_id, product_id, quantity, location, mobile, order_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                product_id,
                quantity,
                userLocation,
                userMobile,
                new Date().toISOString().split("T")[0],
            ]
        );
        await connection.promise().query(
            "DELETE FROM cart WHERE id = ?",
            [cartItemId]
        );*/
        const { product_id, quantity } = cartItems[0];
        await prisma.products.update({
            where: {
                id: parseInt(product_id)
            },
            data: {
                stock: {
                    decrement: parseInt(quantity)
                }
            }
        })
        const result = await prisma.orders.create({
            data: {
                user_id: parseInt(user_id),
                product_id: parseInt(product_id),
                quantity: parseInt(quantity),
                location: userLocation,
                mobile: userMobile,
                order_date: new Date()
            }
        });

        await transporter.sendMail({
            from: process.env.AUTH_MAIL,
            to: user_email,
            subject: "Order Confirmation - Your Order has been placed",
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation</title>
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
                            <h2 style="color: #FFD700; margin-top: 0;">Order Confirmed!</h2>
                            <p class="message">
                                Thank you for your purchase. Your order has been placed successfully and is being processed.
                            </p>
                            
                            <div class="info-box">
                                <p class="order-id">Order #${result.id}</p>
                            </div>
                            
                            <p class="message" style="font-size: 14px; margin-bottom: 0;">
                                We will notify you once your items are shipped.<br>
                                You can track your order status in your dashboard.
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
        });

        return res.status(200).json({ message: "Order confirmed" });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });

    } finally {
        connection.end();
    }
};

export const updateCartItemQuantity = async (req, res) => {
    const { cartItemId, newQuantity } = req.body;
    if (!cartItemId || !newQuantity) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "cartItemId and newQuantity fields are required." });
    }
    try {
        /*const connection = await getConnection();
        console.log("Connected to the database successfully.");
        await connection.promise().query(
            "UPDATE cart SET quantity = ? WHERE id = ?",
            [newQuantity, cartItemId]
        );*/
        const result = await prisma.cart.update({
            where: {
                id: parseInt(cartItemId)
            },
            data: {
                quantity: parseInt(newQuantity)
            }
        })
        console.log("Cart item quantity updated.");
        return res.status(200).json({ message: "Cart item quantity updated." });
        connection.end();
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const clearCart = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.error("Validation error: Missing userId field.");
        return res.status(400).json({ error: "userId field is required." });
    }
    try {
        /*const connection = await getConnection();
        console.log("Connected to the database successfully.");
        await connection.promise().query(
            "DELETE FROM cart WHERE userId = ?",
            [userId]
        );*/
        const result = await prisma.cart.deleteMany({
            where: {
                user_id: parseInt(userId)
            }
        })
        return res.status(200).json({ message: "Cart cleared." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const cartController = {
    addToCart,
    viewCart,
    removeFromCart,
    confirmedOrder,
    updateCartItemQuantity,
    clearCart
};

export default cartController;