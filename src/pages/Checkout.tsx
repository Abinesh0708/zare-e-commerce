/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, CreditCard, Truck, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', phone: '', method: 'card'
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

  return (
    <div className="pt-24 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</span>
                <span>Shipping Information</span>
              </h3>
              <div className="space-y-4">
                <input 
                  required 
                  placeholder="Full Name" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black border-2 outline-none transition-all font-medium"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input 
                  required type="email" placeholder="Email Address" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black border-2 outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <input 
                  required placeholder="Shipping Address" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black border-2 outline-none transition-all font-medium"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
                <input 
                  required type="tel" placeholder="Phone Number" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black border-2 outline-none transition-all font-medium"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</span>
                <span>Payment Method</span>
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'card', icon: <CreditCard />, label: 'Card' },
                  { id: 'upi', icon: <Wallet />, label: 'UPI' },
                  { id: 'cod', icon: <Truck />, label: 'COD' }
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, method: method.id })}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
                      formData.method === method.id ? 'border-black bg-black text-white shadow-xl translate-y-[-4px]' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    {method.icon}
                    <span className="text-xs font-bold uppercase">{method.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <button type="submit" className="w-full bg-lime-400 text-black py-6 rounded-full font-black uppercase text-sm tracking-widest shadow-xl hover:bg-black hover:text-white transition-all transform hover:scale-[1.02]">
              Place Order ₹{totalPrice.toLocaleString('en-IN')}
            </button>
          </form>

          {/* Order Summary */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Your Order</h3>
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-lime-600 font-bold uppercase text-xs">Free</span>
                </div>
                <div className="flex justify-between font-black text-2xl pt-2">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-12 rounded-[3.5rem] max-w-lg w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} className="text-black" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Order Success!</h2>
              <p className="text-gray-500 text-lg mb-10">
                Thank you, {formData.name}! Your order has been placed successfully. We'll email your receipt to {formData.email}.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-lime-500 hover:text-black transition-all"
              >
                Return Home
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
