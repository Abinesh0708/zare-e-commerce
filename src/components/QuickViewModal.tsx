/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext.tsx';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-black hover:text-white transition-all shadow-md"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="md:w-1/2 aspect-[3/4] md:h-[600px] bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Side */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="mb-auto">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  {product.category}
                </span>
                <h2 className="text-3xl font-black tracking-tighter mb-4 leading-tight">
                  {product.name}
                </h2>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center text-amber-400">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 text-sm font-bold text-black">{product.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400">({product.reviews} Reviews)</span>
                </div>

                <div className="flex items-baseline space-x-3 mb-8">
                  <span className="text-3xl font-black">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-300 line-through font-bold">${product.originalPrice}</span>
                  )}
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-lime-400 hover:text-black transition-all flex items-center justify-center space-x-3"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
                <div className="text-center">
                  <a 
                    href={`/product/${product.id}`}
                    className="text-[10px] font-black uppercase underline underline-offset-4 tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    View Full Details
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
