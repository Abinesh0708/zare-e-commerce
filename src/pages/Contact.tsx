/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully!');
  };

  return (
    <div id="contact-page" className="pt-24 pb-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Get in Touch</h1>
          <p className="text-gray-500 text-base md:text-lg px-4 sm:px-0">
            Have questions about our collections or an existing order? Our team is here to help you redefine your style.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email Us</h4>
                  <p className="text-sm text-gray-500">hello@zare.com</p>
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Call Us</h4>
                  <p className="text-sm text-gray-500">+1 (234) 567-890</p>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-12 rounded-[3.5rem] relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black tracking-tight">Visit Our Showroom</h3>
                <div className="flex items-start space-x-4">
                  <MapPin className="text-lime-400 mt-1" />
                  <p className="text-gray-300">
                    123 Fashion Ave, Fashion District<br />
                    New York, NY 10001
                  </p>
                </div>
                <div className="pt-8 flex space-x-6">
                  <Instagram className="hover:text-lime-400 cursor-pointer transition-colors" />
                  <Facebook className="hover:text-lime-400 cursor-pointer transition-colors" />
                  <Twitter className="hover:text-lime-400 cursor-pointer transition-colors" />
                  <MessageCircle className="hover:text-lime-400 cursor-pointer transition-colors" />
                </div>
              </div>
              {/* Abstract Shape */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/20 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video w-full bg-gray-100 rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-gray-100">
              <div className="text-center space-y-4">
                <MapPin size={40} className="mx-auto text-gray-300" />
                <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Interactive Map Placeholder</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-12 rounded-[3.5rem]">
            <h3 className="text-3xl font-black mb-10 tracking-tight">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Full Name</label>
                <input required placeholder="Enter your name" className="w-full px-8 py-4 rounded-2xl border-2 border-transparent bg-white focus:border-black outline-none transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Email Address</label>
                <input required type="email" placeholder="email@example.com" className="w-full px-8 py-4 rounded-2xl border-2 border-transparent bg-white focus:border-black outline-none transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Your Message</label>
                <textarea required rows={5} placeholder="How can we help?" className="w-full px-8 py-4 rounded-2xl border-2 border-transparent bg-white focus:border-black outline-none transition-all font-medium resize-none"></textarea>
              </div>
              <button className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-lime-500 hover:text-black transition-all shadow-lg">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
