const getConnection = require("../services/db.js");
const bcrypt = require("bcrypt");


exports.newUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Fixed validation logic - check if any field is missing
    if (!username || !email || !password) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const connection = await getConnection(); // Fixed: properly await the async function
        console.log("Connected to the database successfully.");

        // Check if user already exists
        const [existingUsers] = await connection.promise().query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: "User already exists with this email or username." });
        }

        const hashedpw = await bcrypt.hash(password, 10); // Fixed: use password instead of user.password
        const user = { username, email, password: hashedpw }; // Fixed: declare user variable

        await connection.promise().query("INSERT INTO users SET ?", user);
        console.log("User created successfully.");

        // Close the connection after use
        await connection.end();

        return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");
        const [users] = await connection.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        console.log("User logged in successfully.");
        const [id, username] = [user.id, user.username];
        const token = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        await connection.end();
        return res.status(200).json({ message: "Login successful." });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error." });
    };


}
exports.getProfile = (req, res) => {
    // req.user is attached by the authenticateToken middleware.
    res.json({ user: req.user });
};
