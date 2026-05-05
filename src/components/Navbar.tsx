/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { products } from '../data/products.ts';
import { Product } from '../types.ts';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (q: string) => {
    if (!q.trim()) return;
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Mobile Menu */}
        <button 
          id="mobile-menu-btn"
          className="md:hidden p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-black uppercase">
          ZARE
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-lime-500 transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-medium hover:text-lime-500 transition-colors">Shop</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-lime-500 transition-colors">Contact</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            id="search-trigger"
            onClick={() => setIsSearchOpen(true)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search size={22} />
          </button>
          <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-lime-400 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white p-8 space-y-12 shadow-2xl z-[80] flex flex-col"
            >
              <div className="flex justify-between items-center">
                <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-black tracking-tighter uppercase">ZARE</Link>
                <button onClick={() => setIsOpen(false)} className="p-2"><X size={24} /></button>
              </div>

              <div className="flex-1 space-y-8">
                <Link to="/" onClick={() => setIsOpen(false)} className="block text-4xl font-black tracking-tighter hover:text-lime-500 transition-colors">Home</Link>
                <Link to="/products" onClick={() => setIsOpen(false)} className="block text-4xl font-black tracking-tighter hover:text-lime-500 transition-colors">Shop</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-4xl font-black tracking-tighter hover:text-lime-500 transition-colors">Contact</Link>
              </div>

              <div className="border-t border-gray-100 pt-8 space-y-4">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Connect with us</p>
                <div className="flex space-x-6">
                  {['Instagram', 'Twitter', 'Facebook'].map(social => (
                    <span key={social} className="text-sm font-bold hover:text-lime-500 cursor-pointer">{social}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ y: -100 }} 
              animate={{ y: 0 }} 
              exit={{ y: -100 }}
              className="fixed top-0 left-0 right-0 bg-white z-[100] shadow-2xl pb-8"
            >
              <div className="max-w-4xl mx-auto px-4">
                <div className="h-24 flex items-center">
                  <Search size={24} className="text-gray-400 mr-4" />
                  <input 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?" 
                    className="flex-1 outline-none text-2xl font-black tracking-tight"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full ml-4">
                    <X size={28} />
                  </button>
                </div>

                {/* Suggestions */}
                {searchQuery.length > 1 && (
                  <div className="py-4 border-t border-gray-100">
                    {suggestions.length > 0 ? (
                      <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Suggestions</span>
                        <div className="grid grid-cols-1 gap-4">
                          {suggestions.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                                navigate(`/product/${p.id}`);
                              }}
                              className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors text-left group"
                            >
                              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                <img src={p.image} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold group-hover:text-lime-600 transition-colors truncate">{p.name}</h4>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{p.category}</p>
                              </div>
                              <span className="font-black text-lime-600">${p.price}</span>
                              <ArrowRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
                          <button 
                            onClick={() => handleSearchSubmit(searchQuery)}
                            className="text-xs font-black uppercase tracking-widest flex items-center space-x-2 text-gray-400 hover:text-black transition-colors"
                          >
                            <span>View all results for "{searchQuery}"</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400 font-bold italic">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
