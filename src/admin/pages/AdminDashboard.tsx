import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../lib/productService';
import { Product } from '../../types';
import {
  Package, TrendingUp, Tag, AlertTriangle,
  PlusCircle, ArrowRight, ShoppingBag, DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const featuredCount = products.filter(p => p.isFeatured).length;
  const lowStock = products.filter(p => p.stockStatus === 'Low Stock').length;
  const outOfStock = products.filter(p => p.stockStatus === 'Out of Stock').length;
  const categories = [...new Set(products.map(p => p.category))];

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'from-violet-600 to-indigo-600',
      shadow: 'shadow-violet-500/20',
    },
    {
      label: 'Total Catalog Value',
      value: `₹${(totalValue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/20',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Tag,
      color: 'from-blue-600 to-cyan-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      label: 'Low/Out of Stock',
      value: lowStock + outOfStock,
      icon: AlertTriangle,
      color: 'from-orange-600 to-red-600',
      shadow: 'shadow-orange-500/20',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Welcome back to ZARE CMS</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-5 py-4">
          <p className="font-semibold text-sm">Database Error</p>
          <p className="text-sm text-red-400/70 mt-1">{error}</p>
          <Link to="/admin/setup" className="text-sm text-red-300 underline mt-2 inline-block">
            Go to Database Setup →
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, shadow }) => (
          <div
            key={label}
            className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/8 transition-all"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg ${shadow} flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">{label}</p>
              <p className="text-white text-2xl font-bold mt-0.5">
                {loading ? <span className="animate-pulse text-white/20">--</span> : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products Table */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold">Recent Products</h2>
          <Link
            to="/admin/products"
            className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-white/30">
            <div className="w-8 h-8 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-12 text-center text-white/30">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No products yet</p>
            <p className="text-sm mt-1">Add your first product to get started</p>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 mt-4 bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs font-medium px-6 py-3">Product</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Category</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Price</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Status</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map(product => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white/10"
                        />
                        <div>
                          <p className="text-white text-sm font-medium truncate max-w-[180px]">{product.name}</p>
                          {product.isFeatured && (
                            <span className="text-violet-400 text-[10px] font-medium">★ Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/50 text-sm">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-sm font-medium">₹{product.price.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        product.stockStatus === 'In Stock'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : product.stockStatus === 'Low Stock'
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
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
              <div key={cat} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm font-medium">{cat}</span>
                  <span className="text-white/40 text-xs">{count} items</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-white/30 text-xs mt-1 block">{pct}% of catalog</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
