/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowUpRight } from 'lucide-react';
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
  const location = useLocation();

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

  const navLinks = [
    { label: 'Collection', path: '/products' },
    { label: 'Shirts', path: '/products?cat=Shirts' },
    { label: 'Outerwear', path: '/products?cat=Outerwear' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F6F2] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Left: Mobile Menu & Desktop Navigation */}
        <div className="flex items-center space-x-8">
          <button 
            id="mobile-menu-btn"
            className="md:hidden p-2 text-[#111111] hover:text-[#6B665F] transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden md:flex items-center space-x-8 text-[13px] tracking-[0.08em] uppercase font-semibold text-[#6B665F]">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`transition-colors py-1 relative ${isActive ? 'text-[#111111]' : 'hover:text-[#111111]'}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Brand Wordmark (Monumental Editorial Presence) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link 
            to="/" 
            className="font-display font-extrabold text-2xl sm:text-3xl tracking-[-0.04em] text-[#111111] uppercase hover:opacity-85 transition-opacity"
          >
            ZARE
          </Link>
        </div>

        {/* Right: Search & Cart Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button 
            id="search-trigger"
            onClick={() => setIsSearchOpen(true)} 
            className="p-2 text-[#111111] hover:text-[#6B665F] transition-colors flex items-center space-x-2"
            aria-label="Search collection"
          >
            <Search size={20} strokeWidth={1.75} />
            <span className="hidden lg:inline text-[12px] uppercase tracking-[0.08em] font-medium text-[#6B665F]">
              Search
            </span>
          </button>

          <Link 
            to="/cart" 
            className="p-2 text-[#111111] hover:text-[#6B665F] transition-colors relative flex items-center space-x-2"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            <span className="hidden sm:inline text-[12px] uppercase tracking-[0.08em] font-medium text-[#6B665F]">
              Bag
            </span>
            {totalItems > 0 && (
              <span className="bg-[#111111] text-[#F7F6F2] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ml-1">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-[70]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#F7F6F2] p-8 space-y-10 z-[80] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center pb-8">
                  <Link 
                    to="/" 
                    onClick={() => setIsOpen(false)} 
                    className="font-display font-extrabold text-2xl tracking-tight uppercase"
                  >
                    ZARE
                  </Link>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-[#111111]">
                    <X size={22} />
                  </button>
                </div>

                <div className="mt-8 space-y-6">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#8E8A82] font-semibold block">
                    Navigation
                  </span>
                  <div className="space-y-4">
                    <Link 
                      to="/" 
                      onClick={() => setIsOpen(false)} 
                      className="block font-display text-3xl font-bold tracking-tight text-[#111111] hover:text-[#6B665F]"
                    >
                      Home
                    </Link>
                    <Link 
                      to="/products" 
                      onClick={() => setIsOpen(false)} 
                      className="block font-display text-3xl font-bold tracking-tight text-[#111111] hover:text-[#6B665F]"
                    >
                      All Collections
                    </Link>
                    <Link 
                      to="/products?cat=Shirts" 
                      onClick={() => setIsOpen(false)} 
                      className="block font-display text-3xl font-bold tracking-tight text-[#111111] hover:text-[#6B665F]"
                    >
                      Shirts & Linen
                    </Link>
                    <Link 
                      to="/products?cat=Outerwear" 
                      onClick={() => setIsOpen(false)} 
                      className="block font-display text-3xl font-bold tracking-tight text-[#111111] hover:text-[#6B665F]"
                    >
                      Outerwear & Wool
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={() => setIsOpen(false)} 
                      className="block font-display text-3xl font-bold tracking-tight text-[#111111] hover:text-[#6B665F]"
                    >
                      Atelier & Contact
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-3 text-xs text-[#6B665F]">
                <p className="font-medium">Curated contemporary apparel.</p>
                <p className="text-[11px] text-[#8E8A82]">Designed for permanence, not seasons.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Editorial Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/40 z-[90]"
            />
            <motion.div
              initial={{ y: -40, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -40, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-[#F7F6F2] z-[100] pb-8 sm:pb-10"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="h-16 sm:h-20 flex items-center bg-[#EFECE6] px-4 sm:px-6">
                  <Search size={20} className="text-[#8E8A82] mr-3 sm:mr-4 shrink-0" />
                  <input 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by garment, fabric, or category..." 
                    className="flex-1 bg-transparent outline-none font-display text-lg sm:text-2xl text-[#111111] placeholder:text-[#A8A49C]"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)} 
                    className="p-2 text-[#111111] hover:text-[#6B665F] transition-colors ml-2 sm:ml-4"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Popular Keywords / Instant Results */}
                {searchQuery.length <= 1 ? (
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#8E8A82] font-semibold mr-2">
                      Suggested:
                    </span>
                    {['Linen Shirt', 'Virgin Wool', 'Oxford', 'Denim', 'Overcoat'].map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => handleSearchSubmit(keyword)}
                        className="text-xs font-medium px-3.5 py-1.5 bg-[#EFECE6] hover:bg-[#E5E1D8] text-[#111111] transition-colors"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8">
                    {suggestions.length > 0 ? (
                      <div className="space-y-4">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#8E8A82] font-semibold block">
                          Matching Pieces ({suggestions.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {suggestions.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                                navigate(`/product/${p.id}`);
                              }}
                              className="flex items-center space-x-4 p-3 bg-[#EFECE6] hover:bg-[#E5E1D8] text-left transition-colors group"
                            >
                              <div className="w-16 h-20 bg-[#ECE8E1] overflow-hidden shrink-0">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] text-[#8E8A82] uppercase tracking-[0.1em] font-semibold block">
                                  {p.category}
                                </span>
                                <h4 className="font-semibold text-sm text-[#111111] truncate group-hover:underline">
                                  {p.name}
                                </h4>
                                <span className="text-xs font-bold text-[#111111] mt-1 block">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <ArrowUpRight size={16} className="text-[#8E8A82] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                        <div className="pt-6 flex justify-center">
                          <button 
                            onClick={() => handleSearchSubmit(searchQuery)}
                            className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] hover:underline"
                          >
                            View all results for "{searchQuery}" →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-[#6B665F] font-medium text-sm">
                        No pieces found matching "{searchQuery}".
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
