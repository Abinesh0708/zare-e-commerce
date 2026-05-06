/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts.ts';
import { useCart } from '../context/CartContext.tsx';
import { Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, Share2, Instagram, MessageCircle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductDetailsSkeleton } from '../components/Skeleton.tsx';


export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  // ── Fetch single product from Supabase (with static fallback) ──
  const { product, loading: isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="pt-24 pb-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <ProductDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 text-center">
        <h1 className="text-4xl font-black">Product Not Found</h1>
        <button onClick={() => navigate('/products')} className="mt-4 underline">Back to Shop</button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="product-detail" className="pt-24 pb-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 relative">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={product.images[selectedImage] || product.image}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-24 h-32 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-black' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <nav className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              <button onClick={() => navigate('/')}>Home</button>
              <span>/</span>
              <button onClick={() => navigate('/products')}>Collections</button>
              <span>/</span>
              <span className="text-black">{product.category}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className={i < Math.floor(product.rating) ? 'fill-current' : ''} />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-400">({product.reviews} reviews)</span>
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${product.stockStatus === 'In Stock' ? 'bg-lime-100 text-lime-700' : 'bg-red-100 text-red-700'}`}>
                {product.stockStatus}
              </span>
            </div>

            <div className="flex items-baseline space-x-4 mb-10">
              <span className="text-4xl font-black">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-300 line-through font-bold">₹{product.originalPrice}</span>
              )}
            </div>

            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center space-x-6 mb-8">
              <span className="font-bold uppercase text-xs tracking-widest">Quantity</span>
              <div className="flex items-center border-2 border-black rounded-full px-4 py-2 space-x-6">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-lime-500"><Minus size={18} /></button>
                <span className="font-bold w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-lime-500"><Plus size={18} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addToCart(product, quantity)}
                className="w-full sm:flex-1 bg-black text-white py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-lime-500 hover:text-black transition-all"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => { addToCart(product, quantity); navigate('/cart'); }}
                className="w-full sm:flex-1 bg-lime-400 text-black py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-black hover:text-white transition-all shadow-lg text-center"
              >
                Buy Now
              </button>
            </div>

            {/* Social Share */}
            <div className="flex items-center space-x-6 mb-12 border-t border-gray-100 pt-8">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share:</span>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:text-lime-500 transition-colors"><MessageCircle size={20} /></button>
                <button className="p-2 hover:text-lime-500 transition-colors"><Instagram size={20} /></button>
                <button onClick={handleCopy} className="p-2 hover:text-lime-500 transition-colors flex items-center space-x-2">
                  <Copy size={18} />
                  {copied && <span className="text-[10px] font-black uppercase text-lime-600">Copied!</span>}
                </button>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-gray-100">
              {Object.entries(product.specs).map(([label, val]) => (
                <div key={label}>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</span>
                  <span className="font-bold">{val}</span>
                </div>
              ))}
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4 pt-12">
              <div className="text-center p-4 rounded-2xl bg-gray-50 space-y-2">
                <Truck size={24} className="mx-auto text-lime-500" />
                <p className="text-[10px] font-bold uppercase">Free Shipping</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gray-50 space-y-2">
                <ShieldCheck size={24} className="mx-auto text-lime-500" />
                <p className="text-[10px] font-bold uppercase">Secure Pay</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gray-50 space-y-2">
                <RotateCcw size={24} className="mx-auto text-lime-500" />
                <p className="text-[10px] font-bold uppercase">Easy Return</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
