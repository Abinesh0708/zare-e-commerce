import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById } from '../lib/productService';
import { products as staticProducts } from '../data/products';
import { Product } from '../types';

/**
 * Fetches all products from Supabase.
 * Falls back to static data if Supabase is not configured.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const hasSupabase = Boolean(
      import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    if (!hasSupabase) {
      // No Supabase configured — use static data
      setProducts(staticProducts);
      setLoading(false);
      return;
    }

    fetchProducts()
      .then(data => {
        // If DB is empty, show static products as fallback
        setProducts(data.length > 0 ? data : staticProducts);
      })
      .catch(() => {
        // DB error — gracefully fall back to static data
        setProducts(staticProducts);
        setError('Using cached data');
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

/**
 * Fetches a single product by ID from Supabase.
 * Falls back to static data if Supabase is not configured or product not found.
 */
export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const hasSupabase = Boolean(
      import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    if (!hasSupabase) {
      setProduct(staticProducts.find(p => p.id === id) || null);
      setLoading(false);
      return;
    }

    fetchProductById(id)
      .then(data => {
        // If not found in DB, try static fallback
        setProduct(data || staticProducts.find(p => p.id === id) || null);
      })
      .catch(() => {
        setProduct(staticProducts.find(p => p.id === id) || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading };
}
