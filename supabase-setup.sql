-- ================================================================
-- ZARE E-Commerce CMS — Supabase Database Setup
-- Run this SQL in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  category TEXT NOT NULL DEFAULT 'Shirts',
  image TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  rating NUMERIC NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'In Stock',
  specs JSONB NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access (for the storefront)
DROP POLICY IF EXISTS "Allow public read" ON products;
CREATE POLICY "Allow public read" ON products
  FOR SELECT USING (true);

-- 4. Allow all operations for anon key (CMS uses anon key)
DROP POLICY IF EXISTS "Allow anon write" ON products;
CREATE POLICY "Allow anon write" ON products
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ================================================================
-- Storage bucket for product images
-- ================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow anon uploads" ON storage.objects;
CREATE POLICY "Allow anon uploads" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow anon deletes" ON storage.objects;
CREATE POLICY "Allow anon deletes" ON storage.objects
  FOR DELETE TO anon USING (bucket_id = 'product-images');
