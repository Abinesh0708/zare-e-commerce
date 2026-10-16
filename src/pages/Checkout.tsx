/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, CreditCard, Truck, Wallet, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', city: '', postal: '', phone: '', method: 'card'
  });

  if (cart.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 100);
  };

  if (isSuccess) {
    return (
      <div className="pt-36 pb-32 px-4 bg-[#F7F6F2] min-h-svh text-[#111111]">
        <div className="max-w-md mx-auto text-center space-y-6 bg-[#EFECE6] p-10">
          <div className="w-12 h-12 bg-[#111111] text-[#F7F6F2] flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#736E67] font-semibold block mb-1">
              Order Confirmed
            </span>
            <h1 className="font-display font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
              Thank You
            </h1>
          </div>

          <p className="text-sm text-[#6B665F] leading-relaxed">
            Your archive request has been placed and received by our atelier dispatch. A confirmation email with tracking credentials has been sent.
          </p>

          <div className="pt-4 text-xs text-[#736E67] space-y-1">
            <p>Order Reference: <span className="font-semibold tracking-[0.08em] text-[#111111]">ZR-{Math.floor(100000 + Math.random() * 900000)}</span></p>
            <p>Estimated Dispatch: 24 - 48 Hours</p>
          </div>

          <div className="pt-4">
            <Link 
              to="/products"
              className="block w-full bg-[#111111] text-[#F7F6F2] py-4 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2B2B2B] transition-colors"
            >
              Continue to Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#111111] min-h-svh">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 sm:mb-12 pb-4">
          <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#736E67] block mb-1">
            Secure Atelier Transaction
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-5xl uppercase tracking-[-0.03em] text-[#111111]">
            Checkout
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Order Summary Sidebar — top on mobile, right on desktop */}
          <div className="lg:col-span-5 lg:order-2">
            <div className="bg-[#EFECE6] p-6 sm:p-8 space-y-6">
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-[#111111] pb-2">
                Order Contents ({cart.length})
              </h3>

              <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto no-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="p-3 bg-[#F7F6F2] flex items-center space-x-4">
                    <div className="w-14 aspect-[3/4] bg-[#ECE8E1] shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-[#111111] truncate">{item.name}</h4>
                      <span className="text-[10px] text-[#736E67] uppercase tracking-[0.08em] block">
                        Qty: {item.quantity} · {item.category}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-[#111111] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#6B665F]">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#6B665F]">
                  <span>Shipping</span>
                  <span className="text-[#111111] font-semibold uppercase tracking-[0.06em]">Complimentary</span>
                </div>
                <div className="flex justify-between font-display font-bold text-xl text-[#111111] pt-4">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#736E67] pt-4 flex items-center space-x-2">
                <ShieldCheck size={16} className="shrink-0 text-[#111111]" />
                <span>Protected by certified end-to-end checkout encryption</span>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 lg:order-1 space-y-8 sm:space-y-10">
            
            {/* Step 1: Shipping Address */}
            <section className="space-y-5 sm:space-y-6">
              <div className="flex items-center space-x-3 pb-2">
                <span className="w-6 h-6 bg-[#111111] text-[#F7F6F2] text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h2 className="font-display font-bold text-lg uppercase tracking-tight text-[#111111]">
                  Shipping Credentials
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    Full Name *
                  </label>
                  <input 
                    required 
                    placeholder="Recipient name" 
                    className="w-full px-4 py-3.5 bg-[#EFECE6] text-sm text-[#111111] outline-none transition-colors"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    Email Address *
                  </label>
                  <input 
                    required 
                    type="email" 
                    placeholder="name@domain.com" 
                    className="w-full px-4 py-3.5 bg-[#EFECE6] text-sm text-[#111111] outline-none transition-colors"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    Street Address *
                  </label>
                  <input 
                    required 
                    placeholder="House/Apartment, Street name" 
                    className="w-full px-4 py-3.5 bg-[#EFECE6] text-sm text-[#111111] outline-none transition-colors"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    City *
                  </label>
                  <input 
                    required 
                    placeholder="City" 
                    className="w-full px-4 py-3.5 bg-[#EFECE6] text-sm text-[#111111] outline-none transition-colors"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    Postal Code *
                  </label>
                  <input 
                    required 
                    placeholder="PIN / Postal Code" 
                    className="w-full px-4 py-3.5 bg-[#EFECE6] text-sm text-[#111111] outline-none transition-colors"
                    value={formData.postal}
                    onChange={e => setFormData({ ...formData, postal: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="+91 / International number" 
                    className="w-full px-4 py-3.5 bg-[#EFECE6] text-sm text-[#111111] outline-none transition-colors"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section className="space-y-5 sm:space-y-6">
              <div className="flex items-center space-x-3 pb-2">
                <span className="w-6 h-6 bg-[#111111] text-[#F7F6F2] text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h2 className="font-display font-bold text-lg uppercase tracking-tight text-[#111111]">
                  Payment Protocol
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card', icon: <CreditCard size={18} />, label: 'Card' },
                  { id: 'upi', icon: <Wallet size={18} />, label: 'UPI' },
                  { id: 'cod', icon: <Truck size={18} />, label: 'COD' }
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, method: method.id })}
                    className={`p-4 transition-colors flex flex-col items-center justify-center space-y-2 text-xs font-semibold uppercase tracking-[0.1em] touch-manipulation ${
                      formData.method === method.id 
                        ? 'bg-[#111111] text-[#F7F6F2]' 
                        : 'bg-[#EFECE6] text-[#111111] hover:bg-[#E5E1D8]'
                    }`}
                  >
                    {method.icon}
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-[#EFECE6] p-4 text-xs text-[#6B665F]">
                {formData.method === 'card' && 'Major credit/debit cards accepted. 256-bit encrypted checkout.'}
                {formData.method === 'upi' && 'Instant payment via Google Pay, PhonePe, Paytm, or any UPI ID.'}
                {formData.method === 'cod' && 'Cash on delivery available with pin code verification upon arrival.'}
              </div>
            </section>

            <div>
              <button
                type="submit"
                className="w-full bg-[#111111] text-[#F7F6F2] py-4 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2B2B2B] active:scale-[0.98] transition-all touch-manipulation"
              >
                Place Order · ₹{totalPrice.toLocaleString('en-IN')}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
