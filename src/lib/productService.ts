import { supabase } from '../lib/supabase';
import { Product } from '../types';

// Map Supabase row to our Product type
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    category: row.category,
    image: row.image,
    images: row.images || [],
    description: row.description,
    rating: row.rating,
    reviews: row.reviews,
    stockStatus: row.stock_status,
    specs: row.specs || {},
    isFeatured: row.is_featured || false,
  };
}

// Map our Product type to Supabase row format
function productToRow(product: Partial<Product>) {
  return {
    name: product.name,
    price: product.price,
    original_price: product.originalPrice ?? null,
    category: product.category,
    image: product.image,
    images: product.images || [],
    description: product.description,
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    stock_status: product.stockStatus ?? 'In Stock',
    specs: product.specs || {},
    is_featured: product.isFeatured ?? false,
  };
}

// ── FETCH ALL PRODUCTS ──────────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(rowToProduct);
}

// ── FETCH SINGLE PRODUCT ────────────────────────────────────────────────────
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return rowToProduct(data);
}

// ── CREATE PRODUCT ──────────────────────────────────────────────────────────
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert([productToRow(product)])
    .select()
    .single();

  if (error) throw error;
  return rowToProduct(data);
}

// ── UPDATE PRODUCT ──────────────────────────────────────────────────────────
export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({ ...productToRow(product), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rowToProduct(data);
}

// ── DELETE PRODUCT ──────────────────────────────────────────────────────────
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ── UPLOAD IMAGE ────────────────────────────────────────────────────────────
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// ── DELETE IMAGE ────────────────────────────────────────────────────────────
export async function deleteProductImage(url: string): Promise<void> {
  const path = url.split('/product-images/')[1];
  if (!path) return;

  await supabase.storage.from('product-images').remove([path]);
}

// ── SEED DATABASE from static data ─────────────────────────────────────────
export async function seedDatabase(products: Product[]): Promise<void> {
  const rows = products.map(p => ({ ...productToRow(p), id: p.id }));
  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}
