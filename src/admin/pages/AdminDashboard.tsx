import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../lib/productService';
import { Product } from '../../types';
import {
  Package, Tag, AlertTriangle,
  PlusCircle, ArrowRight, ShoppingBag, DollarSign, TrendingUp,
} from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalValue    = products.reduce((sum, p) => sum + p.price, 0);
  const featuredCount = products.filter(p => p.isFeatured).length;
  const lowStock      = products.filter(p => p.stockStatus === 'Low Stock').length;
  const outOfStock    = products.filter(p => p.stockStatus === 'Out of Stock').length;
  const categories    = [...new Set(products.map(p => p.category))];

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      bg: 'bg-violet-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600',
      text: 'text-violet-700',
      sub: `${featuredCount} featured`,
    },
    {
      label: 'Catalog Value',
      value: `₹${(totalValue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      bg: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      text: 'text-emerald-700',
      sub: `avg ₹${products.length ? Math.round(totalValue / products.length).toLocaleString() : 0}`,
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Tag,
      bg: 'bg-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      text: 'text-blue-700',
      sub: categories.slice(0, 2).join(', ') || '—',
    },
    {
      label: 'Stock Issues',
      value: lowStock + outOfStock,
      icon: AlertTriangle,
      bg: 'bg-orange-50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
      text: 'text-orange-700',
      sub: `${outOfStock} out of stock`,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back to ZARE CMS</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-5 py-4">
          <p className="font-semibold text-sm">Database Error</p>
          <p className="text-sm text-rose-500 mt-1">{error}</p>
          <Link to="/admin/setup" className="text-sm text-rose-700 underline mt-2 inline-block">
            Go to Firebase Setup →
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, bg, iconBg, text, sub }) => (
          <div
            key={label}
            className={`${bg} border border-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all`}
          >
            <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-500 text-xs font-medium">{label}</p>
              <p className={`${text} text-2xl font-black mt-0.5`}>
                {loading ? <span className="animate-pulse text-slate-200">--</span> : value}
              </p>
              <p className="text-slate-400 text-xs truncate">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            <h2 className="text-slate-800 font-bold">Recent Products</h2>
          </div>
          <Link
            to="/admin/products"
            className="flex items-center gap-1 text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-500">No products yet</p>
            <p className="text-sm mt-1">Add your first product to get started</p>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 mt-4 bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-slate-400 text-xs font-semibold px-6 py-3 uppercase tracking-wider">Product</th>
                  <th className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider">Category</th>
                  <th className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider">Price</th>
                  <th className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.slice(0, 8).map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200"
                        />
                        <div>
                          <p className="text-slate-800 text-sm font-semibold truncate max-w-[180px]">{product.name}</p>
                          {product.isFeatured && (
                            <span className="text-violet-500 text-[10px] font-semibold">★ Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-800 text-sm font-bold">₹{product.price.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        product.stockStatus === 'In Stock'
                          ? 'bg-emerald-100 text-emerald-700'
                          : product.stockStatus === 'Low Stock'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-violet-600 hover:text-violet-700 text-sm font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            const pct = Math.round((count / products.length) * 100);
            return (
              <div key={cat} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-700 text-sm font-semibold">{cat}</span>
                  <span className="text-slate-400 text-xs">{count} items</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-slate-400 text-xs mt-1.5 block">{pct}% of catalog</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
