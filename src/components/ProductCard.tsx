/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const isLowStock = product.stockStatus === 'Low Stock';
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);

  return (
    <motion.article 
      id={`product-${product.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col"
    >
      {/* Editorial Image Frame */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE8E1] mb-4">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop';
            }}
          />
        </Link>
        
        {/* Understated Editorial Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="bg-[#111111] text-[#F7F6F2] text-[10px] font-semibold tracking-[0.1em] px-2.5 py-1 uppercase">
              Sale
            </span>
          )}
          {isLowStock && (
            <span className="bg-[#A64B2A] text-[#F7F6F2] text-[10px] font-semibold tracking-[0.1em] px-2.5 py-1 uppercase">
              Limited
            </span>
          )}
        </div>

        {/* Desktop Quick Add Bar */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="hidden md:flex absolute inset-x-3 bottom-3 bg-[#111111] text-[#F7F6F2] py-3 px-4 text-xs font-semibold uppercase tracking-[0.12em] items-center justify-center space-x-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-opacity transition-transform duration-300 hover:bg-[#2B2B2B]"
          aria-label={`Add ${product.name} to bag`}
        >
          <ShoppingBag size={14} />
          <span>Add to Bag</span>
        </button>

        {/* Mobile Quick Add Button (Touch Target) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          className="md:hidden absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#111111]/90 text-[#F7F6F2] flex items-center justify-center active:scale-90 transition-transform"
          aria-label={`Add ${product.name} to bag`}
        >
          <ShoppingBag size={13} />
        </button>
      </div>

      {/* Typography & Price Metadata */}
      <div className="flex flex-col space-y-0.5 sm:space-y-1">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.1em] text-[#736E67]">
          <span className="truncate">{product.category}</span>
          {product.rating && (
            <span className="font-medium text-[#111111] shrink-0 ml-1">{product.rating}</span>
          )}
        </div>

        <Link 
          to={`/product/${product.id}`} 
          className="font-display font-medium text-xs sm:text-base text-[#111111] group-hover:underline underline-offset-4 line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center space-x-2 pt-0.5">
          <span className="font-bold text-xs sm:text-sm text-[#111111]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-[#8E8A82] line-through text-[11px] sm:text-xs">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
