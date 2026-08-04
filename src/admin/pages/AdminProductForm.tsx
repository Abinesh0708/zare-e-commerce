import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct, updateProduct, fetchProductById,
  uploadProductImage, deleteProductImage,
} from '../../lib/productService';
import { Product } from '../../types';
import {
  Save, ArrowLeft, Upload, X, PlusCircle,
  Image as ImageIcon, Loader2, Star, AlertCircle, Trash2,
} from 'lucide-react';

const CATEGORIES   = ['Shirts', 'Pants', 'Outerwear', 'Accessories', 'Dresses', 'Shoes', 'Bags'];
const STOCK_OPTIONS: Product['stockStatus'][] = ['In Stock', 'Low Stock', 'Out of Stock'];

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '', price: 0, originalPrice: undefined, category: 'Shirts',
  image: '', images: [], description: '', rating: 4.5, reviews: 0,
  stockStatus: 'In Stock', specs: {}, isFeatured: false,
};

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all";
const selectCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all appearance-none";
const labelCls  = "block text-slate-600 text-sm font-semibold mb-1.5";

export default function AdminProductForm() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const isEdit    = Boolean(id) && id !== 'new';

  const [form, setForm]               = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [loading, setLoading]         = useState(isEdit);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [specRows, setSpecRows]       = useState<{ key: string; value: string }[]>([]);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchProductById(id)
        .then(p => {
          if (p) {
            const { id: _id, ...rest } = p;
            setForm(rest);
            setSpecRows(Object.entries(rest.specs).map(([key, value]) => ({ key, value })));
          }
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => {
    const specs: Record<string, string> = {};
    specRows.forEach(r => { if (r.key.trim()) specs[r.key.trim()] = r.value; });
    setForm(prev => ({ ...prev, specs }));
  }, [specRows]);

  const handleField = <K extends keyof Omit<Product, 'id'>>(key: K, value: Omit<Product, 'id'>[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    setError('');
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file);
        uploadedUrls.push(url);
      }
      const newImages = [...form.images, ...uploadedUrls];
      setForm(prev => ({ ...prev, images: newImages, image: prev.image || uploadedUrls[0] }));
    } catch (e: any) {
      setError('Image upload failed: ' + e.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const newImages = [...form.images, url];
      setForm(prev => ({ ...prev, images: newImages, image: prev.image || url }));
    }
  };

  const removeImage = async (url: string) => {
    if (url.includes('firebasestorage')) {
      try { await deleteProductImage(url); } catch { /* ignore */ }
    }
    const newImages = form.images.filter(u => u !== url);
    setForm(prev => ({
      ...prev, images: newImages,
      image: prev.image === url ? (newImages[0] || '') : prev.image,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name.trim())     return setError('Product name is required.');
    if (!form.price || form.price <= 0) return setError('Price must be greater than 0.');
    if (!form.image)           return setError('At least one product image is required.');
    if (!form.description.trim()) return setError('Description is required.');

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateProduct(id, form);
        setSuccess('Product updated successfully!');
      } else {
        const created = await createProduct(form);
        setSuccess('Product created successfully!');
        setTimeout(() => navigate(`/admin/products/${created.id}/edit`), 1500);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isEdit ? `Editing ID: ${id}` : 'Fill in the details to add a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-slate-700 font-bold text-xs uppercase tracking-wider">Basic Information</h2>

              <div>
                <label className={labelCls}>Product Name *</label>
                <input type="text" value={form.name}
                  onChange={e => handleField('name', e.target.value)}
                  className={inputCls} placeholder="e.g. Premium Linen Shirt" required />
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea value={form.description}
                  onChange={e => handleField('description', e.target.value)}
                  rows={4} className={inputCls + ' resize-none'}
                  placeholder="Describe the product in detail..." required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category *</label>
                  <select value={form.category}
                    onChange={e => handleField('category', e.target.value)}
                    className={selectCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Stock Status *</label>
                  <select value={form.stockStatus}
                    onChange={e => handleField('stockStatus', e.target.value as Product['stockStatus'])}
                    className={selectCls}>
                    {STOCK_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-slate-700 font-bold text-xs uppercase tracking-wider">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Sale Price (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                    <input type="number" value={form.price || ''}
                      onChange={e => handleField('price', Number(e.target.value))}
                      className={inputCls + ' pl-7'} placeholder="3999" min="0" required />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Original Price (₹) <span className="text-slate-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                    <input type="number" value={form.originalPrice || ''}
                      onChange={e => handleField('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className={inputCls + ' pl-7'} placeholder="5499" min="0" />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Shows as strikethrough / discount</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Rating (0–5)</label>
                  <input type="number" value={form.rating}
                    onChange={e => handleField('rating', Math.min(5, Math.max(0, Number(e.target.value))))}
                    className={inputCls} placeholder="4.5" min="0" max="5" step="0.1" />
                </div>
                <div>
                  <label className={labelCls}>Review Count</label>
                  <input type="number" value={form.reviews}
                    onChange={e => handleField('reviews', Number(e.target.value))}
                    className={inputCls} placeholder="0" min="0" />
                </div>
              </div>
            </section>

            {/* Specs */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-slate-700 font-bold text-xs uppercase tracking-wider">Specifications</h2>
                <button type="button"
                  onClick={() => setSpecRows(prev => [...prev, { key: '', value: '' }])}
                  className="flex items-center gap-1.5 text-violet-600 hover:text-violet-700 text-sm font-semibold transition-colors">
                  <PlusCircle className="w-4 h-4" /> Add Spec
                </button>
              </div>
              {specRows.length === 0 && (
                <p className="text-slate-400 text-sm">No specifications yet. Add material, size, care instructions, etc.</p>
              )}
              {specRows.map((row, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input type="text" value={row.key}
                    onChange={e => { const u = [...specRows]; u[i] = { ...u[i], key: e.target.value }; setSpecRows(u); }}
                    className="w-36 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                    placeholder="e.g. Material" />
                  <span className="text-slate-300">:</span>
                  <input type="text" value={row.value}
                    onChange={e => { const u = [...specRows]; u[i] = { ...u[i], value: e.target.value }; setSpecRows(u); }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                    placeholder="e.g. 100% Cotton" />
                  <button type="button"
                    onClick={() => setSpecRows(prev => prev.filter((_, j) => j !== i))}
                    className="p-1.5 text-slate-300 hover:text-rose-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </section>
          </div>

          {/* ── RIGHT ──────────────────────────────────── */}
          <div className="space-y-5">

            {/* Images */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-slate-700 font-bold text-xs uppercase tracking-wider">Product Images</h2>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl p-6 text-center cursor-pointer transition-all group bg-slate-50 hover:bg-violet-50"
              >
                {uploadingImages ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
                    <p className="text-slate-500 text-sm">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-violet-300 group-hover:bg-violet-50 transition-colors flex items-center justify-center">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                    <p className="text-slate-600 text-sm font-semibold">Click to upload images</p>
                    <p className="text-slate-400 text-xs">PNG, JPG, WebP up to 5MB each</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => handleImageUpload(e.target.files)} />

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-slate-400 text-xs">or</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <button type="button" onClick={handleAddImageUrl}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm transition-all font-medium">
                <ImageIcon className="w-4 h-4" />
                Add Image via URL
              </button>

              {form.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {form.images.map((url, i) => (
                    <div key={i}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        form.image === url ? 'border-violet-400 shadow-md shadow-violet-200' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setForm(prev => ({ ...prev, image: url }))}
                    >
                      <img src={url} alt={`Image ${i + 1}`} className="w-full h-24 object-cover" />
                      {form.image === url && (
                        <div className="absolute bottom-1 left-1">
                          <span className="bg-violet-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">MAIN</span>
                        </div>
                      )}
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(url); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-white/90 hover:bg-rose-500 hover:text-white rounded-full text-slate-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-slate-400 text-xs">Click an image to set it as the main display image.</p>
            </section>

            {/* Settings */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-slate-700 font-bold text-xs uppercase tracking-wider">Settings</h2>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-violet-500" />
                  <span className="text-slate-600 text-sm font-medium">Featured Product</span>
                </div>
                <div
                  onClick={() => handleField('isFeatured', !form.isFeatured)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${form.isFeatured ? 'bg-violet-500' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isFeatured ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
              <p className="text-slate-400 text-xs">Featured products appear on the homepage hero section.</p>
            </section>

            {/* Discount preview */}
            {form.price > 0 && form.originalPrice && form.originalPrice > form.price && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <p className="text-emerald-700 text-sm font-bold">
                  🏷️ {Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}% off
                </p>
                <p className="text-emerald-600 text-xs mt-0.5">
                  Savings: ₹{(form.originalPrice - form.price).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold">
            ✓ {success}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end pb-8">
          <button type="button" onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-sm font-medium transition-all">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-500/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
