/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div id="contact-page" className="pt-20 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#111111] min-h-svh">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Header */}
        <header className="mb-10 sm:mb-14 pb-4 max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#736E67] block mb-2">
            Correspondence
          </span>
          <h1 className="font-display font-extrabold text-[clamp(2rem,7vw,4rem)] uppercase tracking-[-0.04em] text-[#111111] leading-tight">
            Atelier & Client Care
          </h1>
          <p className="text-sm text-[#6B665F] mt-3 sm:mt-4 leading-relaxed">
            For inquiries regarding textile provenance, sizing consultations, private showroom appointments, or existing orders.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">

          {/* Right Column: Correspondence Form (top on mobile) */}
          <div className="lg:col-span-7 lg:order-2 bg-[#EFECE6] p-6 sm:p-10">
            <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-[#111111] mb-2">
              Send a Dispatch
            </h3>
            <p className="text-xs text-[#6B665F] mb-6 sm:mb-8">
              Fill out the form below. A member of our client care atelier will review and respond promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    Your Name *
                  </label>
                  <input 
                    required 
                    placeholder="Full name" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#F7F6F2] text-sm text-[#111111] outline-none transition-colors" 
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                    Email Address *
                  </label>
                  <input 
                    required 
                    type="email" 
                    placeholder="name@domain.com" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#F7F6F2] text-sm text-[#111111] outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#F7F6F2] text-sm text-[#111111] outline-none transition-colors cursor-pointer"
                >
                  <option value="Inquiry">General Inquiry</option>
                  <option value="Order">Existing Order Inquiry</option>
                  <option value="Sizing">Sizing & Material Consultation</option>
                  <option value="Appointment">Showroom Appointment</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#736E67] block mb-1.5">
                  Your Message *
                </label>
                <textarea 
                  required 
                  rows={5} 
                  placeholder="How may our atelier assist you?" 
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#F7F6F2] text-sm text-[#111111] outline-none transition-colors resize-none" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#111111] text-[#F7F6F2] py-4 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2B2B2B] active:scale-[0.98] transition-all touch-manipulation"
              >
                Transmit Message
              </button>

              {submitted && (
                <div className="p-3 bg-[#F7F6F2] text-xs font-semibold text-[#111111] flex items-center justify-center space-x-2">
                  <Check size={16} className="text-green-700" />
                  <span>Your message has been transmitted to our atelier.</span>
                </div>
              )}
            </form>
          </div>
          
          {/* Left Column: Direct Atelier Information */}
          <div className="lg:col-span-5 lg:order-1 space-y-6 sm:space-y-8">
            
            <div className="space-y-3 sm:space-y-4">
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#736E67] block">
                Direct Channels
              </span>

              <div className="bg-[#EFECE6] p-5 sm:p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#736E67] font-semibold block">
                  Client Correspondence
                </span>
                <a href="mailto:hello@zare.com" className="font-display font-bold text-lg text-[#111111] hover:underline block">
                  hello@zare.com
                </a>
                <p className="text-xs text-[#6B665F]">
                  Response window: within 24 atelier hours.
                </p>
              </div>

              <div className="bg-[#EFECE6] p-5 sm:p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#736E67] font-semibold block">
                  Telephone & Atelier Line
                </span>
                <span className="font-display font-bold text-lg text-[#111111] block">
                  +1 (234) 567-890
                </span>
                <p className="text-xs text-[#6B665F]">
                  Monday to Friday, 09:00 – 18:00 EST.
                </p>
              </div>
            </div>

            {/* Showroom Details */}
            <div className="bg-[#0E0E0E] text-[#F7F6F2] p-6 sm:p-8 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#D4C3B3] font-semibold block">
                Physical Atelier
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight">
                New York Showroom
              </h3>
              <p className="text-xs text-[#A39E96] leading-relaxed">
                123 Fashion Ave, Fashion District<br />
                New York, NY 10001
              </p>
              <div className="pt-2 text-xs text-[#7A756D]">
                Open for bespoke consultations and archive viewing by prior appointment.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
