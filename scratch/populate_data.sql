-- Fix MacBook images (ID 5)
DELETE FROM product_images WHERE product_id = 5;
INSERT INTO product_images (product_id, image_path) VALUES
(5, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000'),
(5, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000');

-- Add variants for all new products (9 to 56)
-- Products already exist, but they have no price/stock without variants
INSERT INTO product_variants (product_id, sku, stock_quantity, price)
SELECT id, CONCAT(UPPER(REPLACE(name, ' ', '-')), '-BASE'), 15, price FROM products WHERE id BETWEEN 9 AND 56;

-- Add images for Laptops (Category 7, 10)
INSERT INTO product_images (product_id, image_path)
SELECT id, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000' FROM products WHERE category_id IN (7, 10) AND id > 8;

-- Add images for Smartphones (Category 8)
INSERT INTO product_images (product_id, image_path)
SELECT id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000' FROM products WHERE category_id = 8 AND id > 8;

-- Add images for Components (Category 11, 12, 9)
INSERT INTO product_images (product_id, image_path)
SELECT id, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000' FROM products WHERE category_id IN (9, 11, 12) AND id > 8;
