// models/adminModel.js
const { pool } = require('../config/db');

const AdminModel = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT admin_id, name, email, role, created_at FROM admins WHERE admin_id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, hashedPassword, role = 'ADMIN' }) {
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },
};

module.exports = AdminModel;
