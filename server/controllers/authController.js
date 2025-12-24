import getConnection from "../services/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../services/prisma.js";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


/*const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS
    }
});*/

export const newUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        //const connection = await getConnection();
        console.log("Connected to the database successfully.");


        /*const [existingUsers] = await connection.promise().query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );*/

        const existingUser = await prisma.users.findMany({
            where: { email }
        });


        if (existingUser.length > 0) {
            return res.status(409).json({ error: "User already exists with this email" });
        }

        const hashedpw = await bcrypt.hash(password, 10);
        //const user = { username, email, password: hashedpw };

        //const [result] = await connection.promise().query("INSERT INTO users SET ?", user);
        const result = await prisma.users.create({
            data: {
                username: username,
                email: email,
                password: hashedpw
            }
        })
        console.log("User created successfully.");


        //await connection.end();

        await sendOTPverificationEmail({ _id: result.id, email: email }, res);
        console.log(result);
        return res.status(201).json({ userId: result.id, message: "User created successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.error("Validation error: Missing fields.");
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        //const connection = await getConnection();
        console.log("Connected to the database successfully.");
        //const [users] = await connection.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        const users = await prisma.users.findMany({
            where: {
                email: email
            }
        })

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
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        //await connection.end();
        return res.status(200).json({ message: "Login successful." });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error." });
    };


}
export const getProfile = (req, res) => {
    // req.user is attached by the authenticateToken middleware.
    res.json({ user: req.user });

};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful." });
};


export const verifyOTP = async (req, res) => {
    const { user_id, user_username, user_email, otp } = req.body;
    if (!user_id || !otp || !user_username || !user_email) {
        return res.status(400).json({ error: "User ID and OTP are required." });
    }
    try {
        //const connection = await getConnection();
        //const [userOTPverificationRecords] = await connection.promise().query("SELECT * FROM user_otp WHERE user_id = ?", [user_id]);
        const userOTPverificationRecords = await prisma.user_otp.findMany({
            where: {
                user_id: parseInt(user_id)

            }
        })
        if (userOTPverificationRecords.length === 0) {
            return res.status(400).json({ error: "OTP not found. Please request a new one." });
        } else {
            const expires_at = userOTPverificationRecords[0].expires_at;
            const hashedOTP = userOTPverificationRecords[0].otp;

            if (expires_at < Date.now()) {
                //await connection.promise().query("DELETE FROM user_otp WHERE user_id = ?", [user_id]);
                //await connection.end();
                await prisma.user_otp.deleteMany({
                    where: {
                        user_id: parseInt(user_id)
                    }
                })
                return res.status(400).json({ error: "OTP has expired. Please request a new one." });
            } else {
                const isOTPValid = await bcrypt.compare(otp.toString(), hashedOTP);
                if (!isOTPValid) {
                    return res.status(400).json({ error: "Invalid OTP. Please try again." });
                } else {
                    //await connection.promise().query("UPDATE users SET verified = ? WHERE id = ?", [true, user_id]);
                    await prisma.users.update({
                        where: {
                            id: parseInt(user_id)
                        },
                        data: {
                            verified: true

                        },
                        data: {
                            verified: true
                        }
                    })
                    //await connection.promise().query("DELETE FROM user_otp WHERE user_id = ?", [user_id]);
                    await prisma.user_otp.deleteMany({
                        where: {
                            user_id: parseInt(user_id)

                        }
                    })
                    //await connection.end();
                    const [id, username] = [user_id, user_username,];
                    const token = jwt.sign({ id, username, email: user_email, role: "user" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
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
            subject: "Verify your email - Gym Management",
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #1a1a0a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background-color: #FFD700; padding: 20px; text-align: center; }
                    .header h1 { margin: 0; color: #1a1a0a; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
                    .content { padding: 40px 30px; text-align: center; color: #ffffff; }
                    .message { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 30px; }
                    .otp-box { background-color: rgba(255, 215, 0, 0.1); border: 2px solid #FFD700; border-radius: 8px; padding: 20px; display: inline-block; margin-bottom: 30px; }
                    .otp-code { font-size: 36px; font-weight: bold; color: #FFD700; letter-spacing: 5px; margin: 0; font-family: 'Courier New', monospace; }
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
                            <h2 style="color: #FFD700; margin-top: 0;">Email Verification</h2>
                            <p class="message">
                                Thank you for registering with Gym Management. To complete your sign-up and verify your email address, please use the One-Time Password (OTP) below.
                            </p>
                            
                            <div class="otp-box">
                                <p class="otp-code">${otp}</p>
                            </div>
                            
                            <p class="message" style="font-size: 14px; margin-bottom: 0;">
                                This code will expire in <strong>60 minutes</strong>.<br>
                                If you did not request this verification, please ignore this email.
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

        const hashedOTP = await bcrypt.hash(otp.toString(), 10);
        //const connection = await getConnection();
        const expires_at = new Date(Date.now() + 3600000);

        /*await connection.promise().query(
            `INSERT INTO user_otp (user_id, otp, created_at, expires_at)
             VALUES (?, ?, NOW(), ?)
             ON DUPLICATE KEY UPDATE otp = ?, created_at = NOW(), expires_at = ?`,
            [_id, hashedOTP, expires_at, hashedOTP, expires_at]
        );*/

        await prisma.user_otp.upsert({
            where: {
                user_id: _id
            },
            update: {
                otp: hashedOTP,
                created_at: new Date(),
                expires_at: expires_at
            },
            create: {
                user_id: _id,
                otp: hashedOTP,
                created_at: new Date(),
                expires_at: expires_at
            }
        })

        //await connection.end();
        console.log("SENDGRID_API_KEY exists:", !!process.env.SENDGRID_API_KEY);
        console.log("FROM:", process.env.SENDGRID_FROM_EMAIL);
        const [response] = await sgMail.send(mailOptions);
        console.log(response);
        console.log(`Sending OTP ${otp} to email: ${email}`);

        return { success: true };
    } catch (err) {
        console.error("Error sending OTP:", err);
        return { success: false };
    }
};


const authController = {
    newUser,
    login,
    getProfile,
    logout,
    verifyOTP
};

export default authController;
