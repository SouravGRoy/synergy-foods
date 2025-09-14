-- Script to convert existing price data from cents to AED
-- This should be run BEFORE applying the schema migration

-- Convert products table prices from cents to AED (divide by 100)
UPDATE products 
SET 
    price = CASE 
        WHEN price IS NOT NULL THEN price / 100.0 
        ELSE NULL 
    END,
    compare_at_price = CASE 
        WHEN compare_at_price IS NOT NULL THEN compare_at_price / 100.0 
        ELSE NULL 
    END,
    cost_per_item = CASE 
        WHEN cost_per_item IS NOT NULL THEN cost_per_item / 100.0 
        ELSE NULL 
    END;

-- Convert product_variants table prices from cents to AED (divide by 100)
UPDATE product_variants 
SET 
    price = price / 100.0,
    compare_at_price = CASE 
        WHEN compare_at_price IS NOT NULL THEN compare_at_price / 100.0 
        ELSE NULL 
    END,
    cost_per_item = CASE 
        WHEN cost_per_item IS NOT NULL THEN cost_per_item / 100.0 
        ELSE NULL 
    END;
