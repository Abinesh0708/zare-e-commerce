/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0E0E0E] text-[#F7F6F2] pt-14 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-12 pb-10 sm:pb-16">
          
          {/* Brand & Manifesto Column — full width on mobile */}
          <div className="col-span-2 md:col-span-5 space-y-4 sm:space-y-6">
            <Link 
              to="/" 
              className="font-display font-extrabold text-2xl sm:text-4xl tracking-[-0.04em] text-[#F7F6F2] uppercase block"
            >
              ZARE
            </Link>
            <p className="text-xs sm:text-sm text-[#A39E96] max-w-sm leading-relaxed">
              Contemporary apparel engineered for permanence. Curated silhouettes, organic European and Asian textile matrices, and uncompromised atelier standards.
            </p>
            <div className="pt-1 text-xs text-[#7A756D] space-y-1">
              <p>Atelier No. 07 · Textile & Pattern Works</p>
              <p>123 Fashion Ave, NY 10001 · By Appointment</p>
            </div>
          </div>

          {/* Directory Links */}
          <div className="col-span-1 md:col-span-2 space-y-3 sm:space-y-4">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#D4C3B3] block">
              Archive
            </span>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-[#A39E96]">
              <li>
                <Link to="/products" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Shirts" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Shirts & Linen
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Outerwear" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Outerwear & Wool
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Pants" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Tailored Trousers
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Accessories" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Leather Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Provenance */}
          <div className="col-span-1 md:col-span-2 space-y-3 sm:space-y-4">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#D4C3B3] block">
              Information
            </span>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-[#A39E96]">
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Atelier & Contact
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Sourcing Manifesto
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors block py-0.5">
                  Care & Preservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care — hidden on mobile, shown on md+ */}
          <div className="hidden md:block md:col-span-3 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#D4C3B3] block">
              Client Service
            </span>
            <div className="text-xs text-[#A39E96] space-y-2">
              <p>Direct inquiries: <a href="mailto:hello@zare.com" className="text-[#F7F6F2] hover:underline">hello@zare.com</a></p>
              <p>Telephone: <span className="text-[#F7F6F2]">+1 (234) 567-890</span></p>
              <p className="text-[11px] text-[#7A756D] pt-2">Hours: Mon – Fri, 09:00 – 18:00 EST</p>
            </div>
          </div>

        </div>

        {/* Colophon & Legal Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#7A756D] gap-3 sm:gap-4 border-t border-[#1E1E1E]">
          <span className="text-center sm:text-left">&copy; {new Date().getFullYear()} ZARE Contemporary Apparel. All rights reserved.</span>
          <div className="flex space-x-5 text-[11px]">
            <Link to="/contact" className="hover:text-[#A39E96] transition-colors">Privacy Register</Link>
            <Link to="/contact" className="hover:text-[#A39E96] transition-colors">Terms of Trade</Link>
            <Link to="/admin" className="hover:text-[#A39E96] transition-colors">Atelier Access</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
