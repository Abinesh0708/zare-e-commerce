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

  const suggested = products.slice(0, 4);

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-32 text-center px-4 bg-[#F7F6F2] min-h-svh text-[#111111]">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-[#EFECE6] flex items-center justify-center mx-auto text-[#736E67]">
            <ShoppingBag size={28} />
          </div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight text-[#111111]">
            Your Bag is Empty
          </h1>
          <p className="text-sm text-[#6B665F]">
            You have not added any pieces to your shopping bag yet. Explore our current season archive.
          </p>
          <div className="pt-2">
            <Link 
              to="/products" 
              className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] bg-[#111111] text-[#F7F6F2] px-8 py-4 hover:bg-[#2B2B2B] transition-colors"
            >
              <span>Explore Collections</span>
              <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page" className="pt-24 sm:pt-28 pb-28 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#111111] min-h-svh">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-10 pb-4 flex justify-between items-end">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#736E67] block mb-1">
              Order Review
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-5xl uppercase tracking-[-0.03em] text-[#111111]">
              Shopping Bag
            </h1>
          </div>
          <span className="text-xs uppercase tracking-[0.1em] text-[#736E67] font-semibold">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
          </span>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Order Summary — appears first on mobile, sidebar on desktop */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="bg-[#EFECE6] p-6 sm:p-8 lg:sticky lg:top-28 space-y-6">
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-[#111111] pb-2">
                Summary
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6B665F]">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#6B665F]">
                  <span>Atelier Dispatch</span>
                  <span className="text-[#111111] font-semibold uppercase tracking-[0.08em] text-xs">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#6B665F]">
                  <span>Applicable Taxes</span>
                  <span className="text-[#111111] font-semibold text-xs">Included</span>
                </div>
                
                <div className="flex justify-between font-display font-bold text-2xl text-[#111111] pt-6">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#111111] text-[#F7F6F2] py-4 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2B2B2B] active:scale-[0.98] transition-all touch-manipulation"
                >
                  Proceed to Checkout
                </button>
              </div>

              <div className="text-[11px] text-[#736E67] space-y-1.5 pt-4">
                <p>• Secured 256-bit payment processing</p>
                <p>• 14-day return and exchange policy</p>
                <p>• Sourced under fair atelier standards</p>
              </div>
            </div>
          </div>

          {/* Cart Items Column */}
          <div className="lg:col-span-8 lg:order-1 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                className="p-4 sm:p-6 bg-[#EFECE6] flex flex-row items-start space-x-3.5 sm:space-x-6"
              >
                <div className="w-20 sm:w-28 aspect-[3/4] bg-[#ECE8E1] overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 w-full flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link 
                        to={`/product/${item.id}`} 
                        className="font-display font-bold text-sm sm:text-lg text-[#111111] hover:underline line-clamp-1 pr-2"
                      >
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-[#8E8A82] hover:text-[#111111] transition-colors p-1 shrink-0"
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.1em] text-[#736E67] block mt-0.5">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 mt-auto">
                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#F7F6F2]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-[#111111] hover:bg-[#E5E1D8] transition-colors touch-manipulation"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[#111111]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-[#111111] hover:bg-[#E5E1D8] transition-colors touch-manipulation"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="font-display font-bold text-sm sm:text-lg text-[#111111]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Curated Suggestions */}
            <div className="pt-10 sm:pt-16">
              <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#736E67] block mb-2">
                Curated Suggestions
              </span>
              <h3 className="font-display font-bold text-lg sm:text-2xl uppercase tracking-tight text-[#111111] mb-6">
                Complementary Archive Items
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {suggested.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
