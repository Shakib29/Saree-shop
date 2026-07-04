// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', adminAuthController.login);
router.get('/me', requireAdmin, adminAuthController.getProfile);

module.exports = router;
