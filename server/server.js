const express = require('express');
const env = require('dotenv')
const cors = require('cors');

env.config();
const app = express();
app.use(express.json());
const authRoutes = require('./routes/auth.js');

app.use(cors({
    origin: 'http://localhost:3001', // The address of your React app
    credentials: true // Required for sending/receiving cookies
}));



app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
console.log(`server running on port :${PORT}`)});

module.exports = app;