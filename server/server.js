const express = require('express');
const env = require('dotenv')
const cors = require('cors');
const cookieParser = require('cookie-parser');


env.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/product.js');
const adminAuthRoutes = require('./routes/adminRoutes/adminAuth.js');
const adminProductRoutes = require('./routes/adminRoutes/adminProduct.js');
app.use(cors({
    origin: 'http://localhost:3001', // The address of your React app
    credentials: true // Required for sending/receiving cookies
}));



app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/product', adminProductRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running on port :${PORT}`)
});

module.exports = app;