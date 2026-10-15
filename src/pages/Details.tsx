/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts.ts';
import { useCart } from '../context/CartContext.tsx';
import { Star, Minus, Plus, Copy, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductDetailsSkeleton } from '../components/Skeleton.tsx';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  // ── Fetch single product from PocketBase (with static fallback) ──
  const { product, loading: isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] min-h-svh">
        <div className="max-w-7xl mx-auto">
          <ProductDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center px-4 min-h-svh bg-[#F7F6F2]">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight text-[#111111]">
          Specimen Not Located
        </h1>
        <p className="text-sm text-[#6B665F] mt-2 mb-6">
          The requested archive item may have been de-listed or re-catalogued.
        </p>
        <Link 
          to="/products" 
          className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] bg-[#111111] text-[#F7F6F2] px-6 py-3"
        >
          <ArrowLeft size={14} className="mr-2" />
          Return to Collections
        </Link>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div id="product-detail" className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#111111]">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-[0.12em] text-[#736E67] mb-8">
          <Link to="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#111111]">Collections</Link>
          <span>/</span>
          <Link to={`/products?cat=${product.category}`} className="hover:text-[#111111]">{product.category}</Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Multi-Angle Studio Photography */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnail Column */}
            {imagesList.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
                {imagesList.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 md:w-24 aspect-[3/4] bg-[#ECE8E1] overflow-hidden transition-opacity duration-200 ${
                      selectedImage === i ? 'opacity-100 ring-2 ring-[#111111]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 aspect-[3/4] bg-[#ECE8E1] overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={imagesList[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-[#111111] text-[#F7F6F2] text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1">
                  Archive Sale
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Garment Specifications & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-[#736E67]">
                <span>{product.category}</span>
                <span className="font-semibold text-[#111111] flex items-center">
                  <Star size={12} className="fill-[#111111] mr-1" />
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-[-0.03em] text-[#111111] leading-tight">
                {product.name}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline space-x-3 pt-1">
                <span className="font-display font-bold text-3xl text-[#111111]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[#8E8A82] line-through text-lg">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 ml-2 ${
                  product.stockStatus === 'In Stock' 
                    ? 'bg-[#EFECE6] text-[#111111]' 
                    : 'bg-[#A64B2A] text-[#F7F6F2]'
                }`}>
                  {product.stockStatus}
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#6B665F] leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="pt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#736E67]">
                Quantity
              </span>
              <div className="flex items-center bg-[#EFECE6]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 hover:bg-[#E5E1D8] text-[#111111] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#111111]">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 hover:bg-[#E5E1D8] text-[#111111] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-[#111111] text-[#F7F6F2] py-4 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2B2B2B] transition-colors flex items-center justify-center space-x-2"
              >
                <span>Add to Shopping Bag</span>
              </button>
              <button 
                onClick={() => { addToCart(product, quantity); navigate('/checkout'); }}
                className="w-full bg-[#EFECE6] text-[#111111] py-4 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#E5E1D8] transition-colors"
              >
                Direct Checkout
              </button>
            </div>

            {/* Garment Specifications Table */}
            {product.specs && (
              <div className="pt-8 space-y-3">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#736E67] block">
                  Garment Specifications
                </span>
                <div className="bg-[#EFECE6] p-5 space-y-2.5 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-[#736E67] uppercase tracking-[0.06em]">{key}</span>
                      <span className="font-semibold text-[#111111] text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provenance Reassurances & Share */}
            <div className="pt-8 flex items-center justify-between text-xs text-[#736E67]">
              <div className="space-y-1">
                <p>• Complimentary Express Shipping within India</p>
                <p>• 14-Day Atelier Exchanges & Returns</p>
              </div>

              <button 
                onClick={handleCopy}
                className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#111111] hover:underline"
              >
                {copied ? <Check size={14} className="text-green-700" /> : <Copy size={14} />}
                <span>{copied ? 'Link Copied' : 'Share Specimen'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Mobile Sticky Add to Bag Bar */}
      <div data-ui="mobile-add-bar" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F6F2] p-3 border-t border-[#E0DDD6] flex items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-col pl-1">
          <span className="font-bold text-sm text-[#111111]">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-[#736E67] uppercase tracking-[0.08em]">{product.stockStatus}</span>
        </div>
        <button 
          onClick={() => addToCart(product, quantity)}
          className="flex-1 bg-[#111111] text-[#F7F6F2] py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center space-x-2 active:bg-[#2B2B2B]"
        >
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
}
