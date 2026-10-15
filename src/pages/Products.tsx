/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts.ts';
import ProductCard from '../components/ProductCard.tsx';
import { SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { ProductCardSkeleton } from '../components/Skeleton.tsx';
import { Link } from 'react-router-dom';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Fetch products from PocketBase (with static fallback) ──
  const { products, loading: isLoading } = useProducts();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('cat') || 'All';

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(12); }, [category, query, sortBy]);

  const allFilteredProducts = useMemo(() => {
    if (isLoading) return [];
    return products.filter(p => {
      const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
      const productText = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => productText.includes(term));
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, query, category, sortBy, isLoading]);

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
        }, 400);
      }
    }, { threshold: 0.1, rootMargin: '200px' });

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, allFilteredProducts.length, isLoading, isMoreLoading]);

  // Derive categories from live DB data
  const categories = (['All', ...Array.from(new Set(products.map(p => p.category)))].sort()) as string[];

  return (
    <div id="products-page" className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 min-h-svh bg-[#F7F6F2] text-[#111111]">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Collection Header */}
        <header className="mb-14 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#736E67] block mb-2">
                Atelier Catalog
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-[-0.04em] text-[#111111]">
                {category === 'All' ? 'Permanent Archive' : category}
              </h1>
              {query && (
                <p className="text-sm text-[#6B665F] mt-2">
                  Showing results for query: <span className="font-bold text-[#111111]">"{query}"</span>
                  <button 
                    onClick={() => setSearchParams({})} 
                    className="ml-3 text-xs underline text-[#736E67] hover:text-[#111111]"
                  >
                    Clear Search
                  </button>
                </p>
              )}
            </div>

            <div className="text-xs text-[#736E67] font-medium tracking-[0.06em]">
              {allFilteredProducts.length} {allFilteredProducts.length === 1 ? 'Specimen' : 'Specimens'} Indexed
            </div>
          </div>

          {/* Category Filter Navigation Bar & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map(cat => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSearchParams(cat === 'All' ? {} : { cat })}
                    className={`px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'bg-[#111111] text-[#F7F6F2]' 
                        : 'text-[#6B665F] hover:text-[#111111] bg-[#EFECE6]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between sm:justify-end space-x-3 text-xs font-semibold text-[#6B665F] shrink-0 pt-2 sm:pt-0">
              <div className="flex items-center space-x-1.5">
                <SlidersHorizontal size={13} />
                <span className="uppercase tracking-[0.1em]">Sort:</span>
              </div>
              <select 
                className="bg-[#EFECE6] px-3 py-1.5 text-[#111111] outline-none cursor-pointer font-bold text-xs"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Latest Release</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </header>

        {/* Product Catalog Grid (Mobile First 2-Column) */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-16">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="py-12 flex justify-center text-xs text-[#736E67]">
              {isMoreLoading && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#111111]" />
                  <span className="uppercase tracking-[0.12em]">Retrieving additional specimens...</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <h2 className="font-display font-bold text-2xl text-[#111111]">No garments found</h2>
            <p className="text-sm text-[#6B665F]">
              There are currently no items matching your criteria in this archive index.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => setSearchParams({})}
                className="inline-flex items-center text-xs font-bold uppercase tracking-[0.14em] bg-[#111111] text-[#F7F6F2] px-6 py-3 hover:bg-[#2B2B2B] transition-colors"
              >
                <ArrowLeft size={14} className="mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
