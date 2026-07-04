// controllers/orderController.js
const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const generateOrderNumber = require('../utils/generateOrderNumber');
const { asyncHandler } = require('../middleware/errorHandler');

const DELIVERY_CHARGE = 99.0;
const FREE_DELIVERY_THRESHOLD = 7000.0;
const VALID_PAYMENT_METHODS = ['UPI', 'Credit Card', 'Cash on Delivery'];

// POST /api/orders/checkout  (works for guests AND logged-in customers — optionalCustomerAuth)
exports.checkout = asyncHandler(async (req, res) => {
  const {
    customerName, mobileNumber, email,
    addressLine, city, state, pinCode,
    items, paymentMethod,
  } = req.body;

  // ---- Validation ----
  if (!customerName || !mobileNumber || !addressLine || !city || !state || !pinCode) {
    return res.status(400).json({ success: false, message: 'All delivery details are required except email.' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty.' });
  }
  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ success: false, message: 'Invalid payment method.' });
  }

  // ---- Verify products, lock in current price, check stock ----
  const resolvedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      return res.status(400).json({ success: false, message: `Product ${item.productId} not found.` });
    }
    if (!product.is_active) {
      return res.status(400).json({ success: false, message: `${product.name} is no longer available.` });
    }
    if (product.stock_quantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock_quantity} unit(s) of ${product.name} left in stock.`,
      });
    }
    const unitPrice = product.discount_price ?? product.price;
    resolvedItems.push({
      productId: product.product_id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: Number(unitPrice),
    });
    subtotal += Number(unitPrice) * item.quantity;
  }

  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const totalAmount = subtotal + deliveryCharge;

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 6);

  const orderNumber = generateOrderNumber();
  const customerId = req.customer ? req.customer.id : null;

  const orderId = await OrderModel.createOrderWithItems({
    orderNumber,
    customerId,
    customerName,
    mobileNumber,
    email,
    addressLine,
    city,
    state,
    pinCode,
    subtotal,
    deliveryCharge,
    totalAmount,
    estimatedDeliveryDate: estimatedDeliveryDate.toISOString().split('T')[0],
    items: resolvedItems,
    paymentMethod,
  });

  const order = await OrderModel.findById(orderId);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order,
  });
});

// GET /api/orders/track/:orderNumber  (public — anyone with the order number can track it)
exports.trackOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findByOrderNumber(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found. Please check your order number.' });
  }
  res.json({ success: true, order });
});

// GET /api/orders/my-orders  (logged-in customers only)
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.findByCustomerId(req.customer.id);
  res.json({ success: true, orders });
});

// ---- Admin-only below ----

// GET /api/admin/orders?status=&page=&limit=
exports.getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const { orders, total } = await OrderModel.findAll({
    status,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
  });
  res.json({
    success: true,
    orders,
    pagination: { total, page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20 },
  });
});

// GET /api/admin/orders/:id
exports.getOrderByIdAdmin = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  res.json({ success: true, order });
});

// PUT /api/admin/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status.' });
  }
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  await OrderModel.updateStatus(req.params.id, status);
  res.json({ success: true, message: 'Order status updated.' });
});

// GET /api/admin/dashboard/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const orderStats = await OrderModel.getStats();
  const totalProducts = await ProductModel.countAll();
  res.json({
    success: true,
    stats: {
      totalProducts,
      totalOrders: orderStats.totalOrders,
      revenue: orderStats.totalRevenue,
      pendingOrders: orderStats.pendingOrders,
    },
  });
});
