import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from "../../services/prisma.js";

// Create assets folder if it doesn't exist
const assetsDir = path.join(process.cwd(), 'uploads/products');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, assetsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

// Export the upload middleware
export const uploadProductImages = upload.array('images', 5);

export const adminAddProduct = async (req, res) => {
    const { name, category, price, description, stock } = req.body;

    if (!name || !category || !price || !description || !stock) {
        console.error("Validation error: Missing fields.");

        // Clean up uploaded files if validation fails
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }

        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        /*const connection = await getConnection();
        console.log("Connected to the database successfully.");*/

        const creation_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Handle image path
        let image_path;
        if (req.files && req.files.length > 0) {
            // Use the first uploaded image or store multiple paths as JSON
            image_path = `/uploads/products/${req.files[0].filename}`;

            // If you want to store multiple images, use:
            // const imagePaths = req.files.map(file => `/Assets/products/${file.filename}`);
            // image_path = JSON.stringify(imagePaths);
        } else {
            // Default placeholder
            image_path = "/uploads/Placeholder_view_vector.svg.png";
        }

        /* await connection.promise().query(
            "INSERT INTO products (name, category, description, current_price, image_path, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, category, description, price, image_path, stock, creation_date]
        );*/
        const result = await prisma.products.create({
            data: {
                name: name,
                category: category,
                description: description,
                current_price: price,
                image_path: image_path,
                stock: parseInt(stock),
                created_at: new Date()
            }
        })
        console.log("Product added successfully.");
        //await connection.end();

        return res.status(201).json({
            message: "Product added successfully.",
            image_path: image_path
        });

    } catch (error) {
        console.error("Database error:", error);

        // Clean up uploaded files if database insert fails
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (unlinkError) {
                    console.error("Error deleting file:", unlinkError);
                }
            });
        }

        return res.status(500).json({ error: "Internal server error." });
    }
};

export const adminDeleteProduct = async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        console.error("Validation error: Missing productId field.");
        return res.status(400).json({ error: "productId field is required." });
    }
    try {
        /* const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [result] = await connection.promise().query(
            "DELETE FROM products WHERE id = ?",
            [productId]
        );

        await connection.end();*/
        const result = await prisma.products.delete({
            where: {
                id: parseInt(productId)
            }
        })
        console.log("Product deleted successfully.");
        return res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const adminUpdateProduct = async (req, res) => {
    const { productId, field, newattributes } = req.body;

    if (!productId || !newattributes || !field) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        /*const connection = await getConnection();
        console.log("Connected to the database successfully.");
        await connection.promise().query(`UPDATE products SET ${field} = ? WHERE id = ?`, [newattributes, productId]);
        await connection.end();*/
        await prisma.products.update({
            where: {
                id: parseInt(productId)
            },
            data: {
                [field]: isNaN(parseFloat(newattributes)) ? newattributes : parseFloat(newattributes)
            }
        })
        return res.status(200).json({ message: "Product updated successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    };
};

export const adminDiscountProduct = async (req, res) => {
    const { productId, newprice, oldprice } = req.body;

    if (!productId || !newprice || !oldprice) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        /* const connection = await getConnection();
         console.log("Connected to the database successfully.");
         await connection.promise().query(`UPDATE products SET current_price = ?, old_price = ? WHERE id = ?`, [newprice, oldprice, productId]);*/
        await prisma.products.update({
            where: {
                id: parseInt(productId)
            },
            data: {
                current_price: parseFloat(newprice),
                old_price: parseFloat(oldprice)
            }
        })
        return res.status(200).json({ message: "Product price updated successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const dashboardStats = async (req, res) => {
    try {
        const totalProducts = await prisma.products.count();

        const lowStockList = await prisma.products.findMany({
            where: {
                stock: {
                    lte: 10,
                },
            },
            select: {
                id: true,
                name: true,
                category: true,
                current_price: true,
                stock: true,
            },
        });

        return res.status(200).json({
            totalProducts, // already a Number
            lowStockCount: lowStockList.length,
            lowStockList,
        });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
    }
};

const adminController = {
    adminAddProduct,
    adminDeleteProduct,
    adminUpdateProduct,
    adminDiscountProduct,
    dashboardStats,
    uploadProductImages
};

export default adminController;