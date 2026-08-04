import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById } from '../lib/productService';
import { products as staticProducts } from '../data/products';
import { Product } from '../types';

/**
 * Fetches all products from Firestore.
 * Falls back to static data if Firebase is not configured.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const hasFirebase = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

    if (!hasFirebase) {
      // No Firebase configured — use static data
      setProducts(staticProducts);
      setLoading(false);
      return;
    }

    fetchProducts()
      .then(data => {
        // If DB is empty, fall back to static products
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
 * Fetches a single product by ID from Firestore.
 * Falls back to static data if Firebase is not configured or product not found.
 */
export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const hasFirebase = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

    if (!hasFirebase) {
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
