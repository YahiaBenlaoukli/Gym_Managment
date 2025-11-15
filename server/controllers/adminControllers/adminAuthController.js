const getConnection = require('../../services/db.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "Email and password are required." });
    }
    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [admins] = await connection.promise().query("SELECT * FROM admin WHERE email = ?", [email]);
        if (admins.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        const admin = admins[0];
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        const token = jwt.sign({ id: admin.id, email: admin.email, role: "admin" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.logoutAdmin = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful." });
}