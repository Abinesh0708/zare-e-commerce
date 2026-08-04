import {
  collection, doc,
  getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Product } from '../types';


// ── IN-MEMORY CACHE ───────────────────────────────────────────────────────────
// Avoids re-fetching Firestore on every page navigation within the same session

let _cache: Product[] | null = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 30_000; // 30 seconds

function isCacheValid() {
  return _cache !== null && Date.now() - _cacheTime < CACHE_TTL_MS;
}

function setCache(products: Product[]) {
  _cache = products;
  _cacheTime = Date.now();
}

export function invalidateCache() {
  _cache = null;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function recordToProduct(id: string, data: Record<string, any>): Product {
  return {
    id,
    name:          data.name          ?? '',
    price:         data.price         ?? 0,
    originalPrice: data.originalPrice ?? undefined,
    category:      data.category      ?? '',
    image:         data.image         ?? '',
    images:        data.images        ?? [],
    description:   data.description   ?? '',
    rating:        data.rating        ?? 0,
    reviews:       data.reviews       ?? 0,
    stockStatus:   data.stockStatus   ?? 'In Stock',
    specs:         data.specs         ?? {},
    isFeatured:    data.isFeatured    ?? false,
  };
}

function productToRecord(product: Partial<Product>): Record<string, any> {
  const rec: Record<string, any> = {};
  if (product.name          !== undefined) rec.name          = product.name;
  if (product.price         !== undefined) rec.price         = product.price;
  if (product.originalPrice !== undefined) rec.originalPrice = product.originalPrice ?? null;
  if (product.category      !== undefined) rec.category      = product.category;
  if (product.image         !== undefined) rec.image         = product.image;
  if (product.images        !== undefined) rec.images        = product.images;
  if (product.description   !== undefined) rec.description   = product.description;
  if (product.rating        !== undefined) rec.rating        = product.rating;
  if (product.reviews       !== undefined) rec.reviews       = product.reviews;
  if (product.stockStatus   !== undefined) rec.stockStatus   = product.stockStatus;
  if (product.specs         !== undefined) rec.specs         = product.specs;
  if (product.isFeatured    !== undefined) rec.isFeatured    = product.isFeatured;
  return rec;
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────────

/**
 * Fetches all products. Returns in-memory cache if fresh (< 30s old).
 * Sorting is done client-side to avoid needing a Firestore index.
 */
export async function fetchProducts(): Promise<Product[]> {
  if (isCacheValid()) return _cache!;

  // No orderBy — avoids Firestore index requirement and is faster
  const snap = await getDocs(collection(db, 'products'));
  const products = snap.docs
    .map(d => recordToProduct(d.id, d.data()))
    .sort((a, b) => a.name.localeCompare(b.name)); // client-side sort

  setCache(products);
  return products;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  // Check cache first to avoid a network round-trip
  if (isCacheValid()) {
    const cached = _cache!.find(p => p.id === id);
    if (cached) return cached;
  }
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return recordToProduct(snap.id, snap.data());
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const docRef = await addDoc(collection(db, 'products'), productToRecord(product));
  invalidateCache();
  return { id: docRef.id, ...product };
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  await updateDoc(doc(db, 'products', id), productToRecord(product));
  invalidateCache();
  // Return merged result without a second round-trip
  const existing = _cache?.find(p => p.id === id);
  return existing ? { ...existing, ...product, id } : (await fetchProductById(id))!;
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
  // Remove from cache immediately — no need to re-fetch
  if (_cache) {
    _cache = _cache.filter(p => p.id !== id);
  }
}

// ── IMAGES ────────────────────────────────────────────────────────────────────

export async function uploadProductImage(file: File): Promise<string> {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteProductImage(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    console.error('Failed to delete image from Firebase Storage:', err);
  }
}

// ── MEDIA LIBRARY ─────────────────────────────────────────────────────────────

export interface MediaFile {
  id:   string;
  name: string;
  url:  string;
  path: string;
}

export async function fetchMediaFiles(): Promise<MediaFile[]> {
  const listRef = ref(storage, 'products/');
  const result  = await listAll(listRef);
  // Fetch all download URLs in parallel
  const files = await Promise.all(
    result.items.map(async item => ({
      id:   item.fullPath,
      name: item.name,
      url:  await getDownloadURL(item),
      path: item.fullPath,
    }))
  );
  return files.sort((a, b) => b.name.localeCompare(a.name));
}

export async function deleteMediaFile(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}

// ── SEED ──────────────────────────────────────────────────────────────────────

export async function seedDatabase(products: Product[]): Promise<void> {
  const BATCH_SIZE = 400;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = products.slice(i, i + BATCH_SIZE);
    for (const p of chunk) {
      const docRef = doc(collection(db, 'products'));
      batch.set(docRef, productToRecord(p));
    }
    await batch.commit();
  }
  invalidateCache();
}

// ── CLEAR DATABASE ────────────────────────────────────────────────────────────

export async function clearDatabase(): Promise<void> {
  const snap  = await getDocs(collection(db, 'products'));
  const BATCH_SIZE = 400;
  const docs  = snap.docs;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    docs.slice(i, i + BATCH_SIZE).forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  invalidateCache();
}
