import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';

import adminAuthRoutes from './routes/adminRoutes/adminAuth.js';
import adminProductRoutes from './routes/adminRoutes/adminProduct.js';
import adminOrderRoutes from './routes/adminRoutes/adminOrder.js';

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/product', adminProductRoutes);
app.use('/api/admin/order', adminOrderRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running on port :${PORT}`);
});

export default app;
