-- Migration: Make promotional_banners.location optional
-- This allows banners to work without specific location requirements

-- Make location column nullable
ALTER TABLE promotional_banners ALTER COLUMN location DROP NOT NULL;

-- Update existing banners with NULL location to use 'global' as default
UPDATE promotional_banners SET location = 'global' WHERE location IS NULL;
