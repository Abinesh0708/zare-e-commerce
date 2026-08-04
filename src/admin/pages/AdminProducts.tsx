import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../lib/productService';
import { Product } from '../../types';
import {
  PlusCircle, Search, Edit2, Trash2,
  Filter, ChevronUp, ChevronDown, Package,
} from 'lucide-react';

type SortKey = 'name' | 'price' | 'category' | 'stockStatus';

export default function AdminProducts() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortKey, setSortKey]             = useState<SortKey>('name');
  const [sortAsc, setSortAsc]             = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [error, setError]                 = useState('');

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
          ? <ChevronUp className="w-3 h-3 text-violet-500" />
          : <ChevronDown className="w-3 h-3 text-violet-500" />
        : <ChevronUp className="w-3 h-3 text-slate-300" />
      }
    </span>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Products</h1>
          <p className="text-slate-400 text-sm">{products.length} total products</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-slate-200 rounded-xl px-10 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-9 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all appearance-none pr-8 shadow-sm"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-semibold">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="text-left text-slate-400 text-xs font-semibold px-6 py-3 uppercase tracking-wider">Image</th>
                  <th
                    className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                    onClick={() => toggleSort('name')}
                  >Name <SortIcon field="name" /></th>
                  <th
                    className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                    onClick={() => toggleSort('category')}
                  >Category <SortIcon field="category" /></th>
                  <th
                    className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                    onClick={() => toggleSort('price')}
                  >Price <SortIcon field="price" /></th>
                  <th
                    className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                    onClick={() => toggleSort('stockStatus')}
                  >Stock <SortIcon field="stockStatus" /></th>
                  <th className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider">Featured</th>
                  <th className="text-left text-slate-400 text-xs font-semibold px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800 text-sm font-semibold max-w-[200px] truncate">{product.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5 font-mono">#{product.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800 text-sm font-bold">₹{product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-slate-400 text-xs line-through">₹{product.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
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
                      {product.isFeatured
                        ? <span className="text-violet-500 text-xs font-bold">★ Yes</span>
                        : <span className="text-slate-300 text-xs">–</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="text-[11px] bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded-lg transition-all disabled:opacity-50"
                            >
                              {deletingId === product.id ? '...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
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

      <p className="text-slate-400 text-xs text-center">
        Showing {filtered.length} of {products.length} products
      </p>
    </div>
  );
}
