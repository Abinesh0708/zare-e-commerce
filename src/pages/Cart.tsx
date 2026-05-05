/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { products } from '../data/products.ts';
import ProductCard from '../components/ProductCard.tsx';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const suggested = products.slice(5, 9);

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Your cart is empty.</h1>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-tight hover:bg-lime-500 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page" className="pt-24 pb-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tighter uppercase">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-8 border-b border-gray-100"
              >
                <div className="w-full sm:w-24 h-48 sm:h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg truncate pr-4">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-4">{item.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 space-x-4">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                    </div>
                    <span className="font-black text-xl">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Suggestions */}
            <div className="mt-24">
              <h3 className="text-2xl font-black mb-8">You may also like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {suggested.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 translate-y-2">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] sticky top-24">
              <h3 className="text-2xl font-black mb-8 border-b border-gray-200 pb-4">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-lime-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-black text-2xl pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-lime-500 hover:text-black transition-all flex items-center justify-center space-x-3"
              >
                <span>Checkout</span>
                <ArrowRight size={18} />
              </button>
              <div className="mt-8 text-center">
                <Link to="/products" className="text-xs font-bold underline underline-offset-4 hover:text-lime-600 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
