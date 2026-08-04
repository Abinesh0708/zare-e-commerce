import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct } from '../../lib/productService';
import { Product } from '../../types';
import { Tag, Edit2, Check, X, Loader2 } from 'lucide-react';

export default function AdminCategories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categoryMap = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const renameCategory = async (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) { setEditingCat(null); return; }
    setSaving(true);
    setError('');
    try {
      const toUpdate = products.filter(p => p.category === oldName);
      await Promise.all(toUpdate.map(p => updateProduct(p.id, { category: newName })));
      setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p));
      setSuccess(`Renamed "${oldName}" → "${newName}" (${toUpdate.length} products updated)`);
      setEditingCat(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const categories = (Object.entries(categoryMap) as [string, Product[]][]).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Categories</h1>
        <p className="text-slate-400 text-sm">{categories.length} categories across {products.length} products</p>
      </div>

      {error   && <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold">✓ {success}</div>}

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-violet-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map(([cat, catProducts]) => (
            <div key={cat} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Tag className="w-4 h-4 text-violet-600" />
              </div>

              <div className="flex-1">
                {editingCat === cat ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') renameCategory(cat, newCatName);
                        if (e.key === 'Escape') setEditingCat(null);
                      }}
                      className="bg-slate-50 border border-violet-300 rounded-lg px-3 py-1.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      autoFocus
                    />
                    <button
                      onClick={() => renameCategory(cat, newCatName)}
                      disabled={saving}
                      className="p-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <button
                      onClick={() => setEditingCat(null)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-800 font-semibold">{cat}</p>
                    <p className="text-slate-400 text-xs">{catProducts.length} products</p>
                  </div>
                )}
              </div>

              {/* Bar */}
              <div className="flex-1 max-w-32 hidden sm:block">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.round((catProducts.length / products.length) * 100)}%` }}
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  {Math.round((catProducts.length / products.length) * 100)}%
                </p>
              </div>

              {editingCat !== cat && (
                <button
                  onClick={() => { setEditingCat(cat); setNewCatName(cat); }}
                  className="p-2 rounded-xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-5 text-center">
        <p className="text-slate-400 text-sm">
          To add a new category, create a product with the new category name in the product form.
        </p>
      </div>
    </div>
  );
}
