// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireCustomer, optionalCustomerAuth } = require('../middleware/auth');

// Guest or logged-in customer can checkout
router.post('/checkout', optionalCustomerAuth, orderController.checkout);

// Anyone with the order number can track it (no login needed)
router.get('/track/:orderNumber', orderController.trackOrder);

// Logged-in customers only
router.get('/my-orders', requireCustomer, orderController.getMyOrders);

module.exports = router;
