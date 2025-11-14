const getConnection = require("../services/db.js");
const jwt = require("jsonwebtoken");

exports.showproductsbycategory = async (req, res) => {
    const { category } = req.body;

    if (!category) {
        console.error("Validation error: Missing category field.");
        return res.status(400).json({ error: "Category field is required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [products] = await connection.promise().query(
            "SELECT * FROM products WHERE category = ?",
            [category]
        )
        return res.status(200).json({ products });

    }
    catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.showallproducts = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [products] = await connection.promise().query(
            "SELECT * FROM products"
        )
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.showproductdetails = async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        console.error("Validation error: Missing productId field.");
        return res.status(400).json({ error: "productId field is required." });
    }

    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [products] = await connection.promise().query(
            "SELECT * FROM products WHERE id = ?",
            [productId]
        );
        if (products.length === 0) {
            return res.status(404).json({ error: "Product not found." });
        }
        return res.status(200).json({ product: products[0] });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

exports.searchproductsbyname = async (req, res) => {
    const { q } = req.body;
    if (!q) {
        console.error("Validation error: Missing search query.");
        return res.status(400).json({ error: "Search query is required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [products] = await connection.promise().query(
            "SELECT id, name, image_path FROM products WHERE name LIKE ? ORDER BY name LIMIT 10",
            [`${q}%`]
        );
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}