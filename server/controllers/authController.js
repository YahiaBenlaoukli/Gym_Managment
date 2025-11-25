const getConnection = require("../services/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS
    }
});

exports.newUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const connection = await getConnection();
        console.log("Connected to the database successfully.");


        const [existingUsers] = await connection.promise().query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: "User already exists with this email or username." });
        }

        const hashedpw = await bcrypt.hash(password, 10);
        const user = { username, email, password: hashedpw };

        const [result] = await connection.promise().query("INSERT INTO users SET ?", user);
        console.log("User created successfully.");


        await connection.end();

        await sendOTPverificationEmail({ _id: result.insertId, email: user.email }, res);

        return res.status(201).json({ userId: result.insertId, message: "User created successfully." });
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
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: "user" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
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

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful." });
};


exports.verifyOTP = async (req, res) => {
    const { user_id, user_username, otp } = req.body;
    if (!user_id || !otp) {
        return res.status(400).json({ error: "User ID and OTP are required." });
    }
    try {
        const connection = await getConnection();
        const [userOTPverificationRecords] = await connection.promise().query("SELECT * FROM user_otp WHERE user_id = ?", [user_id]);
        if (userOTPverificationRecords.length === 0) {
            return res.status(400).json({ error: "OTP not found. Please request a new one." });
        } else {
            const expires_at = userOTPverificationRecords[0].expires_at;
            const hashedOTP = userOTPverificationRecords[0].otp;

            if (expires_at < Date.now()) {
                await connection.promise().query("DELETE FROM user_otp WHERE user_id = ?", [user_id]);
                await connection.end();
                return res.status(400).json({ error: "OTP has expired. Please request a new one." });
            } else {
                const isOTPValid = await bcrypt.compare(otp.toString(), hashedOTP);
                if (!isOTPValid) {
                    return res.status(400).json({ error: "Invalid OTP. Please try again." });
                } else {
                    await connection.promise().query("UPDATE users SET verified = ? WHERE id = ?", [true, user_id]);
                    await connection.promise().query("DELETE FROM user_otp WHERE user_id = ?", [user_id]);
                    await connection.end();
                    const [id, username] = [user_id, user_username,];
                    const token = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    return res.status(200).json({ message: "Email verified successfully." });
                }
            }
        }

    } catch (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const sendOTPverificationEmail = async ({ _id, email }) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);

        const mailOptions = {
            from: process.env.AUTH_MAIL,
            to: email,
            subject: "Verify your email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email.</p>
                   <p>This OTP <b>expires in 60 minutes</b>.</p>`
        };

        const hashedOTP = await bcrypt.hash(otp.toString(), 10);
        const connection = await getConnection();
        const expires_at = new Date(Date.now() + 3600000);

        await connection.promise().query(
            `INSERT INTO user_otp (user_id, otp, created_at, expires_at)
             VALUES (?, ?, NOW(), ?)
             ON DUPLICATE KEY UPDATE otp = ?, created_at = NOW(), expires_at = ?`,
            [_id, hashedOTP, expires_at, hashedOTP, expires_at]
        );

        await connection.end();

        await transporter.sendMail(mailOptions);

        console.log(`Sending OTP ${otp} to email: ${email}`);

        return { success: true };
    } catch (err) {
        console.error("Error sending OTP:", err);
        return { success: false };
    }
};


