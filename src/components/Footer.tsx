/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0E0E0E] text-[#F7F6F2] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-5 space-y-6">
            <Link 
              to="/" 
              className="font-display font-extrabold text-3xl sm:text-4xl tracking-[-0.04em] text-[#F7F6F2] uppercase block"
            >
              ZARE
            </Link>
            <p className="text-sm text-[#A39E96] max-w-sm leading-relaxed">
              Contemporary apparel engineered for permanence. Curated silhouettes, organic European and Asian textile matrices, and uncompromised atelier standards.
            </p>
            <div className="pt-2 text-xs text-[#7A756D] space-y-1">
              <p>Atelier No. 07 · Textile & Pattern Works</p>
              <p>123 Fashion Ave, NY 10001 · By Appointment</p>
            </div>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#D4C3B3] block">
              Archive
            </span>
            <ul className="space-y-2.5 text-xs text-[#A39E96]">
              <li>
                <Link to="/products" className="hover:text-[#F7F6F2] transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Shirts" className="hover:text-[#F7F6F2] transition-colors">
                  Shirts & Linen
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Outerwear" className="hover:text-[#F7F6F2] transition-colors">
                  Outerwear & Wool
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Pants" className="hover:text-[#F7F6F2] transition-colors">
                  Tailored Trousers
                </Link>
              </li>
              <li>
                <Link to="/products?cat=Accessories" className="hover:text-[#F7F6F2] transition-colors">
                  Leather Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Provenance */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#D4C3B3] block">
              Information
            </span>
            <ul className="space-y-2.5 text-xs text-[#A39E96]">
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors">
                  Atelier & Contact
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors">
                  Sourcing Manifesto
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors">
                  Care & Preservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care & Direct Dispatch */}
          <div className="md:col-span-3 space-y-4">
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
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#7A756D] gap-4">
          <span>&copy; {new Date().getFullYear()} ZARE Contemporary Apparel. All rights reserved.</span>
          <div className="flex space-x-6 text-[11px]">
            <Link to="/contact" className="hover:text-[#A39E96] transition-colors">Privacy Register</Link>
            <Link to="/contact" className="hover:text-[#A39E96] transition-colors">Terms of Trade</Link>
            <Link to="/admin" className="hover:text-[#A39E96] transition-colors">Atelier Access</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
