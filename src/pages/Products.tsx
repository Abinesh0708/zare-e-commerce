/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products.ts';
import ProductCard from '../components/ProductCard.tsx';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { ProductCardSkeleton } from '../components/Skeleton.tsx';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('cat') || 'All';

  useEffect(() => {
    // Simulate API fetch delay
    setIsLoading(true);
    setVisibleCount(12); // Reset count on filter change
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [category, query, sortBy]);

  const allFilteredProducts = useMemo(() => {
    if (isLoading) return [];
    return products.filter(p => {
      const searchTerms = query.toLowerCase().split(' ');
      const productText = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      
      const matchesSearch = searchTerms.every(term => productText.includes(term));
      const matchesCategory = category === 'All' || p.category === category;
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [query, category, sortBy, isLoading]);

  const filteredProducts = useMemo(() => {
    return allFilteredProducts.slice(0, visibleCount);
  }, [allFilteredProducts, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && !isMoreLoading && visibleCount < allFilteredProducts.length) {
        setIsMoreLoading(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 12);
          setIsMoreLoading(false);
        }, 500);
      }
    }, { threshold: 0.1, rootMargin: '200px' });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, allFilteredProducts.length, isLoading, isMoreLoading]);

  const categories = ['All', 'Shirts', 'Pants', 'Outerwear', 'Accessories'];

  return (
    <div id="products-page" className="pt-24 pb-24 px-4 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Collections</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchParams(cat === 'All' ? {} : { cat })}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    category === cat ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm font-bold text-gray-400">
                <SlidersHorizontal size={16} />
                <span>Sort by:</span>
                <select 
                  className="bg-transparent text-black outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-20 flex items-center justify-center">
              {isMoreLoading && (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-gray-400 italic">No products found for your search.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
