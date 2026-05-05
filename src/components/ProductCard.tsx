/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      id={`product-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-2xl mb-4">
          <Link to={`/product/${product.id}`}>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'; // Reliability fallback
              }}
            />
          </Link>
          
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-lime-400 text-black text-[10px] font-black px-2 py-1 rounded uppercase">
              Sale
            </div>
          )}

          <button 
            onClick={() => addToCart(product)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg md:translate-y-12 md:group-hover:translate-y-0 transition-transform duration-300 hover:bg-lime-400"
          >
            <ShoppingBag size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</span>
            <div className="flex items-center space-x-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold">{product.rating}</span>
            </div>
          </div>
          <Link to={`/product/${product.id}`} className="block text-sm font-bold group-hover:text-lime-600 transition-colors truncate">
            {product.name}
          </Link>
          <div className="flex items-center space-x-2">
            <span className="font-black text-lg">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </motion.div>
  );
};

export default ProductCard;
