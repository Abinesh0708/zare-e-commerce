/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext.tsx';
import { Link } from 'react-router-dom';

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
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.25 }}
            className="relative bg-[#F7F6F2] w-full max-w-3xl overflow-hidden border border-[#E0DDD6] flex flex-col md:flex-row z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-[#F7F6F2] text-[#111111] hover:bg-[#EFECE6] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="md:w-1/2 aspect-[3/4] bg-[#ECE8E1]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Side */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#736E67] font-semibold block mb-1">
                  {product.category}
                </span>
                <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-[#111111] mb-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="font-display font-bold text-xl text-[#111111]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[#8E8A82] line-through text-sm">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B665F] leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              <div className="space-y-3 pt-6">
                <button
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="w-full bg-[#111111] text-[#F7F6F2] py-3.5 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2B2B2B] transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Bag</span>
                </button>
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="block text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#736E67] hover:text-[#111111] transition-colors"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
