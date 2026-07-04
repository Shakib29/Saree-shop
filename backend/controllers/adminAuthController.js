// controllers/adminAuthController.js
const bcrypt = require('bcryptjs');
const AdminModel = require('../models/adminModel');
const { signToken } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/admin/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const admin = await AdminModel.findByEmail(email.toLowerCase().trim());
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = signToken({ id: admin.admin_id, email: admin.email, role: 'ADMIN' });

  res.json({
    success: true,
    message: 'Login successful.',
    token,
    admin: { id: admin.admin_id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// GET /api/admin/auth/me
exports.getProfile = asyncHandler(async (req, res) => {
  const admin = await AdminModel.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found.' });
  }
  res.json({ success: true, admin });
});
