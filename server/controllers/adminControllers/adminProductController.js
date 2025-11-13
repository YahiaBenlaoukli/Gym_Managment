const { get } = require('../../routes/product.js');
const getConnection = require('../../services/db.js');


exports.adminAddProduct = async (req, res) => {
    const { name, category, price, description, stock } = req.body;
    if (!name || !category || !price || !description || !stock) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const creation_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const product = { name, category, price, description, stock, creation_date };

        await connection.promise().query("INSERT INTO products (name, category, description, current_price, image_path, stock, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?)", [name, category, description, price, null, stock, creation_date]);
        console.log("Product added successfully.");

        await connection.end();
        return res.status(201).json({ message: "Product added successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.adminDeleteProduct = async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        console.error("Validation error: Missing productId field.");
        return res.status(400).json({ error: "productId field is required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [result] = await connection.promise().query(
            "DELETE FROM products WHERE id = ?",
            [productId]
        );

        await connection.end();
        return res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};