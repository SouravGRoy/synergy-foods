-- Migration script to convert prices from cents to AED
-- Run this SQL directly in your database

-- Convert product prices (divide by 100 to convert cents to AED)
UPDATE products 
SET 
  price = CASE WHEN price IS NOT NULL THEN price / 100 ELSE NULL END,
  compare_at_price = CASE WHEN compare_at_price IS NOT NULL THEN compare_at_price / 100 ELSE NULL END,
  cost_per_item = CASE WHEN cost_per_item IS NOT NULL THEN cost_per_item / 100 ELSE NULL END,
  updated_at = NOW()
WHERE price IS NOT NULL OR compare_at_price IS NOT NULL OR cost_per_item IS NOT NULL;

-- Convert product variant prices (divide by 100 to convert cents to AED)
UPDATE product_variants 
SET 
  price = CASE WHEN price IS NOT NULL THEN price / 100 ELSE NULL END,
  compare_at_price = CASE WHEN compare_at_price IS NOT NULL THEN compare_at_price / 100 ELSE NULL END,
  cost_per_item = CASE WHEN cost_per_item IS NOT NULL THEN cost_per_item / 100 ELSE NULL END,
  updated_at = NOW()
WHERE price IS NOT NULL OR compare_at_price IS NOT NULL OR cost_per_item IS NOT NULL;

-- Check the results
SELECT title, price, compare_at_price 
FROM products 
WHERE price IS NOT NULL 
LIMIT 5;
