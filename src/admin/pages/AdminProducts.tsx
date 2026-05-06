import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../lib/productService';
import { Product } from '../../types';
import {
  PlusCircle, Search, Edit2, Trash2, AlertTriangle,
  Filter, ChevronUp, ChevronDown, Package
} from 'lucide-react';

type SortKey = 'name' | 'price' | 'category' | 'stockStatus';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      {sortKey === field
        ? sortAsc
          ? <ChevronUp className="w-3 h-3 text-violet-400" />
          : <ChevronDown className="w-3 h-3 text-violet-400" />
        : <ChevronUp className="w-3 h-3 text-white/20" />
      }
    </span>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-white/40 text-sm">{products.length} total products</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all appearance-none pr-8"
          >
            {categories.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-white/30">
            <div className="w-8 h-8 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-white/30">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr>
                  <th className="text-left text-white/40 text-xs font-medium px-6 py-3">Image</th>
                  <th
                    className="text-left text-white/40 text-xs font-medium px-4 py-3 cursor-pointer hover:text-white/70 select-none"
                    onClick={() => toggleSort('name')}
                  >
                    Name <SortIcon field="name" />
                  </th>
                  <th
                    className="text-left text-white/40 text-xs font-medium px-4 py-3 cursor-pointer hover:text-white/70 select-none"
                    onClick={() => toggleSort('category')}
                  >
                    Category <SortIcon field="category" />
                  </th>
                  <th
                    className="text-left text-white/40 text-xs font-medium px-4 py-3 cursor-pointer hover:text-white/70 select-none"
                    onClick={() => toggleSort('price')}
                  >
                    Price <SortIcon field="price" />
                  </th>
                  <th
                    className="text-left text-white/40 text-xs font-medium px-4 py-3 cursor-pointer hover:text-white/70 select-none"
                    onClick={() => toggleSort('stockStatus')}
                  >
                    Stock <SortIcon field="stockStatus" />
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Featured</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-white/10"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium max-w-[200px] truncate">{product.name}</p>
                      <p className="text-white/30 text-xs mt-0.5">#{product.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-white/5 text-white/60 text-xs px-2.5 py-1 rounded-lg">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-semibold">₹{product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-white/30 text-xs line-through">₹{product.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
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
                      {product.isFeatured
                        ? <span className="text-violet-400 text-xs">★ Yes</span>
                        : <span className="text-white/20 text-xs">–</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="text-[11px] bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-lg transition-all disabled:opacity-50"
                            >
                              {deletingId === product.id ? '...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-white/20 text-xs text-center">
        Showing {filtered.length} of {products.length} products
      </p>
    </div>
  );
}
