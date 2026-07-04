// controllers/productController.js
const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const { asyncHandler } = require('../middleware/errorHandler');

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

// GET /api/products  (public — supports ?category=&search=&newArrival=&bestSeller=&festival=&minPrice=&maxPrice=&sortBy=&sortOrder=&page=&limit=)
exports.getAllProducts = asyncHandler(async (req, res) => {
  const {
    category, search, newArrival, bestSeller, festival,
    minPrice, maxPrice, sortBy, sortOrder, page, limit,
  } = req.query;

  const { products, total } = await ProductModel.findAll({
    categorySlug: category,
    search,
    isNewArrival: newArrival === 'true',
    isBestSeller: bestSeller === 'true',
    isFestivalCollection: festival === 'true',
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy,
    sortOrder,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 12,
  });

  res.json({
    success: true,
    products,
    pagination: {
      total,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
      totalPages: Math.ceil(total / (limit ? Number(limit) : 12)),
    },
  });
});

// GET /api/products/:slug  (public)
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await ProductModel.findBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, product });
});

// ---- Admin-only below ----

// GET /api/admin/products/:id
exports.getProductByIdAdmin = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, product });
});

// POST /api/admin/products
exports.createProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data.name || !data.categoryId || !data.price) {
    return res.status(400).json({ success: false, message: 'Name, categoryId, and price are required.' });
  }

  const category = await CategoryModel.findById(data.categoryId);
  if (!category) {
    return res.status(400).json({ success: false, message: 'Invalid categoryId.' });
  }

  const slug = `${slugify(data.name)}-${Date.now().toString().slice(-5)}`;
  const productId = await ProductModel.create({ ...data, slug });

  // Optional: array of image URLs passed at creation time
  if (Array.isArray(data.images) && data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      await ProductModel.addImage(productId, data.images[i], i === 0, i + 1);
    }
  }

  res.status(201).json({ success: true, message: 'Product created.', productId });
});

// PUT /api/admin/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await ProductModel.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const data = req.body;
  const slug = data.name ? `${slugify(data.name)}-${id}` : existing.slug;

  await ProductModel.update(id, {
    categoryId: data.categoryId ?? existing.category_id,
    name: data.name ?? existing.name,
    slug,
    description: data.description ?? existing.description,
    fabric: data.fabric ?? existing.fabric,
    colour: data.colour ?? existing.colour,
    occasion: data.occasion ?? existing.occasion,
    careInstructions: data.careInstructions ?? existing.care_instructions,
    price: data.price ?? existing.price,
    discountPrice: data.discountPrice ?? existing.discount_price,
    stockQuantity: data.stockQuantity ?? existing.stock_quantity,
    isNewArrival: data.isNewArrival ?? existing.is_new_arrival,
    isBestSeller: data.isBestSeller ?? existing.is_best_seller,
    isFestivalCollection: data.isFestivalCollection ?? existing.is_festival_collection,
    isActive: data.isActive ?? existing.is_active,
  });

  res.json({ success: true, message: 'Product updated.' });
});

// DELETE /api/admin/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await ProductModel.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  await ProductModel.remove(id);
  res.json({ success: true, message: 'Product deleted.' });
});

// POST /api/admin/products/:id/images
exports.addProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { imageUrl, isPrimary, displayOrder } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'imageUrl is required.' });
  }
  const imageId = await ProductModel.addImage(id, imageUrl, !!isPrimary, displayOrder || 0);
  res.status(201).json({ success: true, message: 'Image added.', imageId });
});

// DELETE /api/admin/products/images/:imageId
exports.deleteProductImage = asyncHandler(async (req, res) => {
  await ProductModel.removeImage(req.params.imageId);
  res.json({ success: true, message: 'Image removed.' });
});
