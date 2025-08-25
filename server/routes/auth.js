const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post("/register", authController.newUser);
router.post("/login", authController.login);

module.exports = router;