/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="text-3xl font-black tracking-tighter uppercase">ZARE</Link>
          <p className="text-gray-400 text-sm max-w-xs">
            Redefining contemporary elegance through curated collections and premium essentials.
          </p>
          <div className="flex space-x-4">
            <Instagram size={20} className="text-gray-400 hover:text-white cursor-pointer" />
            <Facebook size={20} className="text-gray-400 hover:text-white cursor-pointer" />
            <Twitter size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/products?cat=Shirts" className="hover:text-white transition-colors">Shirts</Link></li>
            <li><Link to="/products?cat=Pants" className="hover:text-white transition-colors">Pants</Link></li>
            <li><Link to="/products?cat=Outerwear" className="hover:text-white transition-colors">Outerwear</Link></li>
            <li><Link to="/products?cat=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-bold mb-6">Information</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4 text-sm text-gray-400">
          <h4 className="font-bold text-white mb-6">Contact</h4>
          <div className="flex items-center space-x-3">
            <MapPin size={18} />
            <span>123 Fashion Ave, NY 10001</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={18} />
            <span>+1 (234) 567-890</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail size={18} />
            <span>hello@zare.com</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; 2026 ZARE Fashion. All rights reserved. Designed by Abin.
      </div>
    </footer>
  );
}
