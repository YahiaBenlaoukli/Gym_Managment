const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/adminControllers/adminAuthController.js');

router.post("/adminLogin", adminAuthController.loginAdmin);
router.post("/adminLogout", adminAuthController.logoutAdmin);

module.exports = router; 