const getConnection = require('../services/db.js');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS
    }
});

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const creation_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const cartItem = { userId, productId, quantity, creation_date };
        const [result] = await connection.query("INSERT INTO cart SET ?", cartItem);
        console.log("Item added to cart with ID:", result.insertId);
        return res.status(201).json({ message: "Item added to cart.", cartItemId: result.insertId });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

exports.viewCart = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.error("Validation error: Missing userId field.");
        return res.status(400).json({ error: "userId field is required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [cartItems] = await connection.promise().query(
            `SELECT c.id AS cartItemId, c.quantity, p.id AS productId, p.name, p.category, p.description, p.current_price, p.old_price, p.image_path, c.stock
             FROM cart c
             JOIN products p ON c.productId = p.id
             WHERE c.userId = ?`,
            [userId]
        );
        return res.status(200).json(cartItems);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.removeFromCart = async (req, res) => {
    const { cartItemId } = req.body;
    if (!cartItemId) {
        console.error("Validation error: Missing cartItemId field.");
        return res.status(400).json({ error: "cartItemId field is required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [result] = await connection.promise().query(
            "DELETE FROM cart WHERE id = ?",
            [cartItemId]
        );
        return res.status(200).json({ message: "Item removed from cart." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.confirmedOrder = async (req, res) => {
    const { userId, userEmail, cartItemId, userLocation, userMobile } = req.body;

    if (!userId || !cartItemId || !userLocation || !userMobile) {
        return res.status(400).json({ error: "All fields are required." });
    }

    let connection;

    try {
        connection = await getConnection();
        console.log("Connected to the database.");
        const [cartItems] = await connection.promise().query(
            "SELECT * FROM cart WHERE id = ? AND userId = ?",
            [cartItemId, userId]
        );

        if (cartItems.length === 0) {
            return res.status(404).json({ error: "Cart item not found." });
        }

        const { product_id, quantity } = cartItems[0];
        await connection.promise().query(
            "UPDATE products SET stock = stock - ? WHERE id = ?",
            [quantity, product_id]
        );
        const [result] = await connection.promise().query(
            `INSERT INTO orders (user_id, product_id, quantity, location, mobile, order_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
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
        );

        await transporter.sendMail({
            from: process.env.AUTH_MAIL,
            to: userEmail,
            subject: "Order Confirmation - Your Order has been placed",
            html: `
                <p>Dear Customer,</p>
                <p>Your order with ID <strong>${result.insertId}</strong> has been placed.</p>
                <p>We will notify you when it ships.</p>
            `
        });

        return res.status(200).json({ message: "Order confirmed" });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });

    } finally {
        if (connection) connection.release();
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    const { cartItemId, newQuantity } = req.body;
    if (!cartItemId || !newQuantity) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "cartItemId and newQuantity fields are required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        await connection.promise().query(
            "UPDATE cart SET quantity = ? WHERE id = ?",
            [newQuantity, cartItemId]
        );
        return res.status(200).json({ message: "Cart item quantity updated." });
        connection.end();
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.clearCart = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.error("Validation error: Missing userId field.");
        return res.status(400).json({ error: "userId field is required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        await connection.promise().query(
            "DELETE FROM cart WHERE userId = ?",
            [userId]
        );
        return res.status(200).json({ message: "Cart cleared." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};
