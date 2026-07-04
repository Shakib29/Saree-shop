// models/productModel.js
const { pool } = require('../config/db');

const ProductModel = {
  /**
   * Fetch products with optional filters: category slug, search term, flags, pagination.
   */
  async findAll({
    categorySlug,
    search,
    isNewArrival,
    isBestSeller,
    isFestivalCollection,
    minPrice,
    maxPrice,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    page = 1,
    limit = 12,
  } = {}) {
    const conditions = ['p.is_active = TRUE'];
    const params = [];

    if (categorySlug) {
      conditions.push('c.slug = ?');
      params.push(categorySlug);
    }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ? OR p.fabric LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (isNewArrival) conditions.push('p.is_new_arrival = TRUE');
    if (isBestSeller) conditions.push('p.is_best_seller = TRUE');
    if (isFestivalCollection) conditions.push('p.is_festival_collection = TRUE');
    if (minPrice) {
      conditions.push('COALESCE(p.discount_price, p.price) >= ?');
      params.push(minPrice);
    }
    if (maxPrice) {
      conditions.push('COALESCE(p.discount_price, p.price) <= ?');
      params.push(maxPrice);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortColumns = ['price', 'rating', 'created_at', 'name'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const offset = (Math.max(1, page) - 1) * limit;

    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
              (SELECT image_url FROM product_images pi WHERE pi.product_id = p.product_id
               ORDER BY pi.is_primary DESC, pi.display_order ASC LIMIT 1) AS primary_image
       FROM products p
       JOIN categories c ON p.category_id = c.category_id
       ${whereClause}
       ORDER BY p.${safeSortBy} ${safeSortOrder}
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM products p
       JOIN categories c ON p.category_id = c.category_id
       ${whereClause}`,
      params
    );

    return { products: rows, total: countRows[0].total };
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ? LIMIT 1`,
      [id]
    );
    if (!rows[0]) return null;

    const [images] = await pool.query(
      'SELECT image_id, image_url, is_primary, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
      [id]
    );
    return { ...rows[0], images };
  },

  async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p JOIN categories c ON p.category_id = c.category_id
       WHERE p.slug = ? LIMIT 1`,
      [slug]
    );
    if (!rows[0]) return null;

    const [images] = await pool.query(
      'SELECT image_id, image_url, is_primary, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
      [rows[0].product_id]
    );
    return { ...rows[0], images };
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO products
       (category_id, name, slug, description, fabric, colour, occasion, care_instructions,
        price, discount_price, stock_quantity, is_new_arrival, is_best_seller, is_festival_collection, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.categoryId, data.name, data.slug, data.description || null, data.fabric || null,
        data.colour || null, data.occasion || null, data.careInstructions || null,
        data.price, data.discountPrice || null, data.stockQuantity || 0,
        !!data.isNewArrival, !!data.isBestSeller, !!data.isFestivalCollection,
        data.isActive !== undefined ? !!data.isActive : true,
      ]
    );
    return result.insertId;
  },

  async update(id, data) {
    await pool.query(
      `UPDATE products SET
        category_id = ?, name = ?, slug = ?, description = ?, fabric = ?, colour = ?,
        occasion = ?, care_instructions = ?, price = ?, discount_price = ?, stock_quantity = ?,
        is_new_arrival = ?, is_best_seller = ?, is_festival_collection = ?, is_active = ?
       WHERE product_id = ?`,
      [
        data.categoryId, data.name, data.slug, data.description || null, data.fabric || null,
        data.colour || null, data.occasion || null, data.careInstructions || null,
        data.price, data.discountPrice || null, data.stockQuantity || 0,
        !!data.isNewArrival, !!data.isBestSeller, !!data.isFestivalCollection,
        data.isActive !== undefined ? !!data.isActive : true,
        id,
      ]
    );
  },

  async remove(id) {
    await pool.query('DELETE FROM products WHERE product_id = ?', [id]);
  },

  async decrementStock(id, quantity) {
    await pool.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?', [quantity, id]);
  },

  async addImage(productId, imageUrl, isPrimary = false, displayOrder = 0) {
    const [result] = await pool.query(
      'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
      [productId, imageUrl, isPrimary, displayOrder]
    );
    return result.insertId;
  },

  async removeImage(imageId) {
    await pool.query('DELETE FROM product_images WHERE image_id = ?', [imageId]);
  },

  async countAll() {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM products');
    return rows[0].count;
  },
};

module.exports = ProductModel;
