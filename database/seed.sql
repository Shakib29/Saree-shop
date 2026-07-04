-- =====================================================================
-- House of Jaee — Sample Seed Data
-- Run AFTER schema.sql
-- Admin password below is bcrypt hash for: Admin@123
-- =====================================================================

USE house_of_jaee;

-- ---------------------------------------------------------------------
-- ADMIN ACCOUNT  (email: admin@houseofjaee.com / password: Admin@123)
-- ---------------------------------------------------------------------
INSERT INTO admins (name, email, password, role) VALUES
('Jaee Deshmukh', 'admin@houseofjaee.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');
-- NOTE: This hash is a placeholder. The backend seed script (backend/seed/seed.js)
-- generates a fresh correct bcrypt hash for "Admin@123" — use that script instead
-- of relying on this static hash, since bcrypt salts differ per generation.

-- ---------------------------------------------------------------------
-- CATEGORIES (8)
-- ---------------------------------------------------------------------
INSERT INTO categories (name, slug, description, image_url, is_active) VALUES
('Silk Sarees', 'silk-sarees', 'Luxurious pure silk sarees woven with timeless elegance, perfect for weddings and grand celebrations.', '/images/categories/silk-sarees.svg', TRUE),
('Cotton Sarees', 'cotton-sarees', 'Breathable, lightweight cotton sarees ideal for daily wear and warm Indian summers.', '/images/categories/cotton-sarees.svg', TRUE),
('Banarasi Sarees', 'banarasi-sarees', 'Authentic Banarasi sarees featuring intricate zari work and rich brocade patterns from Varanasi.', '/images/categories/banarasi-sarees.svg', TRUE),
('Kanjivaram Sarees', 'kanjivaram-sarees', 'Traditional South Indian Kanjivaram silk sarees known for their vibrant colours and temple borders.', '/images/categories/kanjivaram-sarees.svg', TRUE),
('Designer Sarees', 'designer-sarees', 'Contemporary designer sarees blending modern silhouettes with classic Indian craftsmanship.', '/images/categories/designer-sarees.svg', TRUE),
('Wedding Sarees', 'wedding-sarees', 'Opulent bridal and wedding sarees crafted to make your special day unforgettable.', '/images/categories/wedding-sarees.svg', TRUE),
('Party Wear Sarees', 'party-wear-sarees', 'Glamorous party wear sarees with sequins, embroidery, and statement embellishments.', '/images/categories/party-wear-sarees.svg', TRUE),
('Casual Sarees', 'casual-sarees', 'Easy-to-style everyday sarees combining comfort with effortless elegance.', '/images/categories/casual-sarees.svg', TRUE);

-- ---------------------------------------------------------------------
-- PRODUCTS (15 sample sarees with realistic Indian names/fabrics)
-- ---------------------------------------------------------------------
INSERT INTO products
(category_id, name, slug, description, fabric, colour, occasion, care_instructions, price, discount_price, stock_quantity, rating, rating_count, is_new_arrival, is_best_seller, is_festival_collection, is_active)
VALUES
(1, 'Maroon Mysore Silk Saree', 'maroon-mysore-silk-saree', 'A graceful Mysore silk saree in deep maroon with a delicate gold zari border, perfect for festive occasions.', 'Mysore Silk', 'Maroon', 'Festival, Wedding', 'Dry clean only. Store wrapped in muslin cloth.', 6499.00, 5499.00, 18, 4.6, 132, FALSE, TRUE, TRUE, TRUE),

(1, 'Ivory Tussar Silk Saree', 'ivory-tussar-silk-saree', 'An elegant ivory tussar silk saree with hand-painted Madhubani motifs along the pallu.', 'Tussar Silk', 'Ivory', 'Festival, Office Wear', 'Dry clean recommended.', 5299.00, NULL, 24, 4.4, 87, TRUE, FALSE, FALSE, TRUE),

(2, 'Beige Handloom Cotton Saree', 'beige-handloom-cotton-saree', 'Soft handloom cotton saree in warm beige with a thin maroon border, ideal for everyday elegance.', 'Handloom Cotton', 'Beige', 'Casual, Office Wear', 'Hand wash separately in cold water.', 1899.00, 1499.00, 40, 4.3, 211, FALSE, TRUE, FALSE, TRUE),

(2, 'White Chanderi Cotton Saree', 'white-chanderi-cotton-saree', 'Light and airy Chanderi cotton saree in pristine white with golden thread detailing.', 'Chanderi Cotton', 'White', 'Casual, Festive', 'Dry clean recommended for the first wash.', 2399.00, NULL, 30, 4.5, 64, TRUE, FALSE, FALSE, TRUE),

(3, 'Golden Banarasi Brocade Saree', 'golden-banarasi-brocade-saree', 'Opulent Banarasi brocade saree in rich gold with traditional paisley motifs, a true wedding heirloom.', 'Banarasi Silk', 'Gold', 'Wedding, Reception', 'Dry clean only.', 12999.00, 10999.00, 10, 4.8, 158, FALSE, TRUE, TRUE, TRUE),

(3, 'Dark Brown Banarasi Katan Saree', 'dark-brown-banarasi-katan-saree', 'Classic Katan silk Banarasi saree in dark brown with intricate jaal weaving.', 'Katan Silk', 'Dark Brown', 'Wedding, Festival', 'Dry clean only. Avoid direct sunlight.', 9499.00, NULL, 14, 4.6, 76, FALSE, FALSE, TRUE, TRUE),

(4, 'Maroon Kanjivaram Silk Saree', 'maroon-kanjivaram-silk-saree', 'Authentic Kanjivaram silk saree in maroon with a contrasting gold temple border.', 'Kanjivaram Silk', 'Maroon', 'Wedding, Temple Visit', 'Dry clean only. Fold along original creases.', 14999.00, 12999.00, 8, 4.9, 204, FALSE, TRUE, TRUE, TRUE),

(4, 'Cream Kanjivaram Silk Saree', 'cream-kanjivaram-silk-saree', 'Elegant cream Kanjivaram silk saree with a maroon pallu and traditional temple motifs.', 'Kanjivaram Silk', 'Cream', 'Wedding, Festival', 'Dry clean only.', 13499.00, NULL, 9, 4.7, 91, TRUE, FALSE, FALSE, TRUE),

(5, 'Beige Designer Georgette Saree', 'beige-designer-georgette-saree', 'Modern designer saree in beige georgette with sequin embroidery and a ready-pleated look.', 'Georgette', 'Beige', 'Party, Reception', 'Dry clean only.', 4999.00, 3999.00, 22, 4.2, 53, TRUE, FALSE, FALSE, TRUE),

(5, 'Gold Designer Organza Saree', 'gold-designer-organza-saree', 'Contemporary organza saree in shimmering gold with delicate floral threadwork.', 'Organza', 'Gold', 'Party, Cocktail', 'Dry clean only.', 5799.00, NULL, 16, 4.3, 47, TRUE, FALSE, FALSE, TRUE),

(6, 'Maroon Bridal Silk Saree', 'maroon-bridal-silk-saree', 'A regal bridal silk saree in maroon and gold, heavily embellished for the wedding day.', 'Art Silk', 'Maroon', 'Wedding, Bridal', 'Dry clean only. Professional storage recommended.', 18999.00, 15999.00, 6, 4.8, 119, FALSE, TRUE, TRUE, TRUE),

(6, 'Dark Brown Bridal Velvet Saree', 'dark-brown-bridal-velvet-saree', 'Luxurious velvet-blend bridal saree in dark brown with gold embroidery and stonework.', 'Velvet Blend', 'Dark Brown', 'Wedding, Winter Bridal', 'Dry clean only.', 16999.00, NULL, 5, 4.7, 38, FALSE, FALSE, TRUE, TRUE),

(7, 'Gold Sequin Party Wear Saree', 'gold-sequin-party-wear-saree', 'Glamorous sequinned party wear saree in gold, designed to make a statement at evening events.', 'Net', 'Gold', 'Party, Sangeet', 'Dry clean only.', 3999.00, 3299.00, 28, 4.1, 72, FALSE, TRUE, FALSE, TRUE),

(8, 'Beige Casual Linen Saree', 'beige-casual-linen-saree', 'Breathable linen saree in soft beige, perfect for relaxed daytime wear.', 'Linen', 'Beige', 'Casual, Daily Wear', 'Machine wash gentle cycle.', 1599.00, NULL, 45, 4.0, 96, TRUE, FALSE, FALSE, TRUE),

(8, 'White Casual Cotton Blend Saree', 'white-casual-cotton-blend-saree', 'Simple and elegant cotton blend saree in white with a thin gold border, great for everyday styling.', 'Cotton Blend', 'White', 'Casual, Office Wear', 'Hand wash recommended.', 1299.00, 999.00, 50, 4.2, 143, FALSE, TRUE, FALSE, TRUE);

-- ---------------------------------------------------------------------
-- PRODUCT IMAGES (placeholder SVGs, 2 per product)
-- ---------------------------------------------------------------------
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT product_id, CONCAT('/images/products/product-', product_id, '-1.svg'), TRUE, 1 FROM products;

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT product_id, CONCAT('/images/products/product-', product_id, '-2.svg'), FALSE, 2 FROM products;

-- ---------------------------------------------------------------------
-- SAMPLE ORDERS (10) with order items and payments
-- ---------------------------------------------------------------------
INSERT INTO orders (order_number, customer_id, customer_name, mobile_number, email, address_line, city, state, pin_code, subtotal, delivery_charge, total_amount, order_status, estimated_delivery_date) VALUES
('HOJ-2026-1001', NULL, 'Priya Sharma', '9876543210', 'priya.sharma@example.com', '12 Lotus Apartments, Andheri West', 'Mumbai', 'Maharashtra', '400053', 6499.00, 99.00, 6598.00, 'Delivered', '2026-06-10'),
('HOJ-2026-1002', NULL, 'Anjali Mehta', '9123456780', 'anjali.mehta@example.com', '45 Green Park Colony', 'Delhi', 'Delhi', '110016', 1899.00, 99.00, 1998.00, 'Shipped', '2026-06-29'),
('HOJ-2026-1003', NULL, 'Sneha Iyer', '9988776655', 'sneha.iyer@example.com', '7 Anna Nagar 2nd Street', 'Chennai', 'Tamil Nadu', '600040', 14999.00, 0.00, 14999.00, 'Confirmed', '2026-07-02'),
('HOJ-2026-1004', NULL, 'Kavita Rao', '9090909090', 'kavita.rao@example.com', '23 Jubilee Hills Road No. 5', 'Hyderabad', 'Telangana', '500033', 5299.00, 99.00, 5398.00, 'Pending', '2026-07-04'),
('HOJ-2026-1005', NULL, 'Meera Nair', '9001122334', 'meera.nair@example.com', '88 MG Road', 'Bengaluru', 'Karnataka', '560001', 12999.00, 0.00, 12999.00, 'Packed', '2026-07-01'),
('HOJ-2026-1006', NULL, 'Riya Kapoor', '9876501234', 'riya.kapoor@example.com', '15 Salt Lake Sector 5', 'Kolkata', 'West Bengal', '700091', 3999.00, 99.00, 4098.00, 'Delivered', '2026-06-08'),
('HOJ-2026-1007', NULL, 'Divya Pillai', '9345678901', 'divya.pillai@example.com', '5 Koregaon Park', 'Pune', 'Maharashtra', '411001', 1299.00, 99.00, 1398.00, 'Cancelled', NULL),
('HOJ-2026-1008', NULL, 'Pooja Verma', '9456123789', 'pooja.verma@example.com', '30 Vastrapur Lake Road', 'Ahmedabad', 'Gujarat', '380015', 9499.00, 0.00, 9499.00, 'Shipped', '2026-06-30'),
('HOJ-2026-1009', NULL, 'Neha Joshi', '9234567890', 'neha.joshi@example.com', '18 Civil Lines', 'Jaipur', 'Rajasthan', '302006', 2399.00, 99.00, 2498.00, 'Pending', '2026-07-05'),
('HOJ-2026-1010', NULL, 'Lakshmi Subramaniam', '9812345670', 'lakshmi.s@example.com', '9 T Nagar Main Road', 'Chennai', 'Tamil Nadu', '600017', 18999.00, 0.00, 18999.00, 'Confirmed', '2026-07-03');

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, line_total) VALUES
(1, 1, 'Maroon Mysore Silk Saree', 1, 6499.00, 6499.00),
(2, 3, 'Beige Handloom Cotton Saree', 1, 1899.00, 1899.00),
(3, 7, 'Maroon Kanjivaram Silk Saree', 1, 14999.00, 14999.00),
(4, 2, 'Ivory Tussar Silk Saree', 1, 5299.00, 5299.00),
(5, 5, 'Golden Banarasi Brocade Saree', 1, 12999.00, 12999.00),
(6, 13, 'Gold Sequin Party Wear Saree', 1, 3999.00, 3999.00),
(7, 15, 'White Casual Cotton Blend Saree', 1, 1299.00, 1299.00),
(8, 6, 'Dark Brown Banarasi Katan Saree', 1, 9499.00, 9499.00),
(9, 4, 'White Chanderi Cotton Saree', 1, 2399.00, 2399.00),
(10, 11, 'Maroon Bridal Silk Saree', 1, 18999.00, 18999.00);

INSERT INTO payments (order_id, payment_method, payment_status, amount, transaction_ref, paid_at) VALUES
(1, 'UPI', 'Success', 6598.00, 'TXN-UPI-1001', '2026-06-05 10:15:00'),
(2, 'Credit Card', 'Success', 1998.00, 'TXN-CC-1002', '2026-06-25 14:30:00'),
(3, 'Cash on Delivery', 'Pending', 14999.00, NULL, NULL),
(4, 'UPI', 'Success', 5398.00, 'TXN-UPI-1004', '2026-06-27 09:00:00'),
(5, 'Credit Card', 'Success', 12999.00, 'TXN-CC-1005', '2026-06-26 16:45:00'),
(6, 'UPI', 'Success', 4098.00, 'TXN-UPI-1006', '2026-06-03 11:20:00'),
(7, 'Cash on Delivery', 'Failed', 1398.00, NULL, NULL),
(8, 'Credit Card', 'Success', 9499.00, 'TXN-CC-1008', '2026-06-24 13:10:00'),
(9, 'UPI', 'Pending', 2498.00, NULL, NULL),
(10, 'Credit Card', 'Success', 18999.00, 'TXN-CC-1010', '2026-06-26 18:00:00');
