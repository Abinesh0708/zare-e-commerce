/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useProducts } from '../hooks/useProducts.ts';
import ProductCard from '../components/ProductCard.tsx';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowUpRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // ── Fetch products from PocketBase (with static fallback) ──
  const { products } = useProducts();
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = window.innerWidth > 768 ? 440 : current.clientWidth * 0.85;
      const finalAmount = direction === 'left' ? -scrollAmount : scrollAmount;
      current.scrollBy({ left: finalAmount, behavior: 'smooth' });
    }
  };

  const heroFeatured = products.slice(0, 8);
  const liftedProduct = products[2] || products[0]; // Premium Wool Overcoat
  const runwayProducts = products.slice(0, 6);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 5000);
  };

  return (
    <div id="home-page" className="bg-[#F7F6F2] text-[#111111]">
      
      {/* ── 1. CINEMATIC HERO: SMALL NAME, OPEN SKY ── */}
      <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden pt-28 pb-16">
        {/* Full-bleed Campaign Background with Calm Sky / Neutral Space */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/hero-campaign.jpg" 
            alt="ZARE Autumn Winter Editorial Silhouette" 
            className="w-full h-full object-cover object-[center_30%] scale-110 origin-center"
          />
          {/* Subtle neutral scrim for typographic legibility */}
          <div className="absolute inset-0 bg-[#111111]/30" />
        </div>

        {/* Top Header Layer: Quiet Letterhead Style (Aligned with Navbar Grid) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[#F7F6F2]">
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-medium leading-relaxed">
            <span>ZARE ARCHIVE</span>
            <span className="block opacity-75">AUTUMN / WINTER 2026</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-xs uppercase tracking-[0.16em] text-[#F7F6F2]">
            <Link to="/products" className="hover:opacity-75 transition-opacity underline underline-offset-4">Collection</Link>
            <Link to="/products?cat=Outerwear" className="hover:opacity-75 transition-opacity">Tailoring</Link>
            <Link to="/contact" className="hover:opacity-75 transition-opacity">Care & Atelier</Link>
          </div>
        </div>

        {/* Bottom Hero Layer: Monumental Name & Single Action (Aligned with Navbar Grid) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end text-[#F7F6F2] pt-20 sm:pt-40">
          <div className="lg:col-span-7">
            <h1 className="font-display font-medium text-3xl sm:text-6xl lg:text-7xl leading-[0.96] uppercase tracking-[-0.03em] max-w-2xl">
              PERMANENT ARCHIVE. <br />
              <span className="font-light italic text-[#E5E1D8]">FORM & REDUCTION.</span>
            </h1>
          </div>

          <div className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right space-y-4 w-full">
            <p className="text-xs sm:text-base text-[#E5E1D8] max-w-sm leading-relaxed">
              Silhouettes tailored from unbleached Normandy flax, Biella virgin fleece, and honest proportions.
            </p>
            <Link 
              to="/products"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-[#F7F6F2] text-[#111111] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#E5E1D8] transition-colors"
            >
              <span>Explore The Permanent Collection</span>
              <ArrowRight size={15} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. SHOWCASE: FRAME RUN, ONE LIFTED ── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-end mb-10 sm:mb-16">
            <div className="lg:col-span-5">
              <h2 className="font-display font-bold text-2xl sm:text-5xl uppercase tracking-tight text-[#111111]">
                THE FOUNDATIONAL PIECES.
              </h2>
            </div>
            <div className="lg:col-span-7 flex justify-between items-end gap-4">
              <p className="text-xs sm:text-base text-[#6B665F] max-w-md">
                Each silhouette is engineered without seasonal ornamentation, cut to endure decades of considered wear.
              </p>
              <div className="hidden sm:flex space-x-2 shrink-0">
                <button 
                  onClick={() => scroll('left')}
                  className="w-12 h-12 bg-[#EFECE6] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-[#F7F6F2] transition-colors"
                  aria-label="Previous garments"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-12 h-12 bg-[#111111] text-[#F7F6F2] flex items-center justify-center hover:bg-[#2B2B2B] transition-colors"
                  aria-label="Next garments"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Runway Frame Row (Mobile Swipe Optimized) */}
          <div 
            ref={scrollContainerRef}
            className="flex items-end space-x-4 sm:space-x-8 overflow-x-auto pb-6 sm:pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {/* The Lifted Frame (Hero Garment) */}
            {liftedProduct && (
              <div className="w-[74vw] sm:w-[420px] lg:w-[460px] snap-start shrink-0">
                <Link to={`/product/${liftedProduct.id}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#ECE8E1] overflow-hidden mb-3 sm:mb-4">
                    <img 
                      src={liftedProduct.image} 
                      alt={liftedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#111111] text-[#F7F6F2] text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.14em] px-2.5 py-1 sm:px-3 sm:py-1.5">
                      Archival Centerpiece
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 sm:pt-2">
                    <h3 className="font-display font-bold text-base sm:text-xl uppercase tracking-tight text-[#111111] group-hover:underline">
                      {liftedProduct.name}
                    </h3>
                    <span className="font-bold text-sm sm:text-base text-[#111111]">
                      ₹{liftedProduct.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#6B665F] mt-0.5 sm:mt-1 truncate">
                    {liftedProduct.specs?.Material || 'Virgin Wool & Weather Finish'}
                  </p>
                </Link>
              </div>
            )}

            {/* Standard Run Frames */}
            {runwayProducts.filter(p => p.id !== liftedProduct?.id).map((item) => (
              <div 
                key={item.id}
                className="w-[62vw] sm:w-[300px] lg:w-[340px] snap-start shrink-0"
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. EDITORIAL LOOKBOOK: STAGGERED PAIRS IN EMPTY GROUND ── */}
      <section className="py-20 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#EFECE6]">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-40">
          
          {/* Pair 1: Tailored Silhouette & Pure Linen Drape */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Column 1-5: The Model in Motion */}
            <div className="lg:col-span-5">
              <Link to="/products?cat=Outerwear" className="group block">
                <div className="aspect-[3/4] bg-[#ECE8E1] overflow-hidden mb-4">
                  <img 
                    src="/images/lookbook-outerwear.jpg" 
                    alt="Look 01 Atelier Silhouette" 
                    className="w-full h-full object-cover scale-[1.08] group-hover:scale-[1.14] transition-transform duration-700 ease-out origin-center"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] group-hover:underline">
                    Look 01 · Structured Outerwear
                  </span>
                  <span className="text-xs text-[#736E67]">Atelier Biella</span>
                </div>
                <p className="text-xs text-[#6B665F] mt-1">
                  Cut with generous shoulders and a relaxed, unlined sweep.
                </p>
              </Link>
            </div>

            {/* Column 7-12: The Shirt Detail (Offset lower) */}
            <div className="lg:col-span-6 lg:col-start-7 lg:pt-32">
              <Link to="/product/1" className="group block">
                <div className="aspect-[4/5] bg-[#ECE8E1] overflow-hidden mb-4">
                  <img 
                    src="/images/lookbook-linen.jpg" 
                    alt="Look 02 Oversize Linen Blend" 
                    className="w-full h-full object-cover scale-[1.06] group-hover:scale-[1.12] transition-transform duration-700 ease-out origin-center"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] group-hover:underline">
                    Look 02 · Oversize Linen Shirt
                  </span>
                  <span className="text-xs text-[#736E67]">Normandy Flax</span>
                </div>
                <p className="text-xs text-[#6B665F] mt-1">
                  Breathable 185 GSM plain weave with mother-of-pearl closures.
                </p>
              </Link>
            </div>
          </div>

          {/* Pair 2: Full Grain Leather Carry & Raw Denim */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Column 2-6: Leather Craftsmanship */}
            <div className="lg:col-span-5 lg:col-start-2">
              <Link to="/product/6" className="group block">
                <div className="aspect-[4/3] bg-[#ECE8E1] overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop" 
                    alt="Leather Weekend Bag" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] group-hover:underline">
                    Object 03 · Leather Weekend Bag
                  </span>
                  <span className="text-xs text-[#736E67]">Vegetable Tanned</span>
                </div>
                <p className="text-xs text-[#6B665F] mt-1">
                  Full grain cowhide that patinas with years of journey.
                </p>
              </Link>
            </div>

            {/* Column 8-12: The Tailored Denim (Offset lower) */}
            <div className="lg:col-span-5 lg:col-start-8 lg:pt-24">
              <Link to="/product/4" className="group block">
                <div className="aspect-[3/4] bg-[#ECE8E1] overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1200&auto=format&fit=crop" 
                    alt="Slim Fit Denim Jeans" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] group-hover:underline">
                    Look 04 · Okayama Selvage Denim
                  </span>
                  <span className="text-xs text-[#736E67]">13.5 OZ Weave</span>
                </div>
                <p className="text-xs text-[#6B665F] mt-1">
                  Slow-shuttle woven with reinforced selvedge edge lines.
                </p>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. FEATURES: ROWS WITH MARGIN PHOTOGRAPHS ── */}
      <section className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Statement */}
          <div className="max-w-3xl mb-24 sm:mb-32">
            <h2 className="font-display font-medium text-4xl sm:text-6xl uppercase tracking-[-0.03em] leading-[0.98] text-[#111111]">
              THE DISCIPLINE OF <br />
              <span className="italic font-light text-[#736E67]">HONEST REDUCTION.</span>
            </h2>
          </div>

          {/* Three Feature Rows with Margin Images */}
          <div className="space-y-24 sm:space-y-32">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 lg:col-start-2">
                <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mb-4">
                  Traceable European Fleece
                </h3>
                <p className="text-sm sm:text-base text-[#6B665F] leading-relaxed">
                  Sourced exclusively from non-mulesed flocks in Biella, Italy. Dense natural crimp provides weather resilience without synthetic coatings.
                </p>
              </div>
              <div className="lg:col-span-5 lg:col-start-7">
                <div className="aspect-[16/10] bg-[#ECE8E1] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop" 
                    alt="Natural Fleece Texture" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 lg:col-start-2">
                <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mb-4">
                  Single-Needle French Seams
                </h3>
                <p className="text-sm sm:text-base text-[#6B665F] leading-relaxed">
                  Internal edges are completely turned and bound, ensuring a smooth hand against skin that will never unravel or degrade with washing.
                </p>
              </div>
              <div className="lg:col-span-5 lg:col-start-7">
                <div className="aspect-[4/5] max-h-[380px] bg-[#ECE8E1] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop" 
                    alt="Garment Construction" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 lg:col-start-2">
                <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mb-4">
                  Endurance Over Season
                </h3>
                <p className="text-sm sm:text-base text-[#6B665F] leading-relaxed">
                  We reject the frantic churn of disposable fast fashion. Every silhouette is created to remain relevant and dignified for a lifetime.
                </p>
              </div>
              <div className="lg:col-span-5 lg:col-start-7">
                <div className="aspect-[16/10] bg-[#ECE8E1] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop" 
                    alt="Timeless Tailoring" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. CLOSING CAMPAIGN: LAST PHOTOGRAPH, TEXT BESIDE ── */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden px-4 sm:px-6 lg:px-8 py-20 text-[#F7F6F2]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/closing-campaign.jpg" 
            alt="ZARE Atelier Final Frame" 
            className="w-full h-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-[#111111]/35" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-6 lg:col-start-7 space-y-6">
            <h2 className="font-display font-medium text-4xl sm:text-6xl uppercase tracking-tight leading-[0.96]">
              THE ARCHIVE <br />
              <span className="italic font-light text-[#E5E1D8]">IS COMPLETE.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#E5E1D8] max-w-lg leading-relaxed">
              Explore the entire collection of thirty foundational garments, available now for worldwide delivery.
            </p>
            
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link 
                to="/products"
                className="inline-flex items-center justify-center bg-[#F7F6F2] text-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#E7E3DC] transition-colors"
              >
                <span>Enter The Collection</span>
                <ArrowRight size={15} className="ml-2" />
              </Link>
            </div>

            {/* Quiet Seasonal Register Form */}
            <form data-ui="newsletter-form" onSubmit={handleNewsletterSubmit} className="pt-8 max-w-md">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#E5E1D8] block mb-2 font-medium">
                Seasonal Register
              </span>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email for private dispatches" 
                  className="flex-1 px-4 py-3 bg-[#111111]/60 border border-[#F7F6F2]/30 text-xs text-[#F7F6F2] placeholder:text-[#A39E96] outline-none"
                />
                <button 
                  type="submit"
                  className="bg-[#F7F6F2] text-[#111111] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] hover:bg-[#E5E1D8] transition-colors"
                >
                  Join
                </button>
              </div>
              {newsletterSubscribed && (
                <p className="text-xs text-[#F7F6F2] font-medium mt-2 flex items-center">
                  <Check size={14} className="mr-1 text-emerald-400" />
                  Your correspondence has been received.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
