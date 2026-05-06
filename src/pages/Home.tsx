/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../hooks/useProducts.ts';
import ProductCard from '../components/ProductCard.tsx';
import { ArrowRight, Play, Star, ChevronLeft, ChevronRight, Globe, Sparkles, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RotatingBadge from '../components/RotatingBadge.tsx';

export default function Home() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Fetch products from Supabase (with static fallback) ──
  const { products, loading } = useProducts();
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = window.innerWidth > 768 ? 400 : current.clientWidth * 0.8;
      const finalAmount = direction === 'left' ? -scrollAmount : scrollAmount;
      current.scrollBy({ left: finalAmount, behavior: 'smooth' });
    }
  };

  const featured = products.filter(p => p.isFeatured).slice(0, 4);
  const trending = products.slice(4, 10);
  const newArrivals = products.slice(0, 12);

  return (
    <div id="home-page" className="pt-16">
      {/* Hero Section */}
      <section className="relative px-4 overflow-hidden bg-[#F3F3F3] pt-32 pb-16 lg:pt-0 lg:pb-0 lg:h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="z-10 text-center lg:text-left order-2 lg:order-1"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-white text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
              New Collection 2026
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.95] md:leading-[0.9] mb-8">
              STYLE THAT <br />
              <span className="text-lime-500">DEFINES</span> YOU.
            </h1>
            <p className="text-gray-500 max-w-md mx-auto lg:mx-0 mb-10 text-base md:text-lg px-4 sm:px-0">
              Explore an extensive collection, curated to redefine your wardrobe. Elevate your fashion quotient effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/products" className="w-full sm:w-auto text-center bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-lime-500 hover:text-black transition-all transform hover:scale-105 uppercase text-xs tracking-widest">
                Explore Collection
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative order-1 lg:order-2"
          >
            <div className="bg-lime-300 absolute inset-0 rounded-[2.5rem] md:rounded-[4rem] rotate-3 -z-10 transition-colors duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop" 
              alt="Hero Fashion" 
              className="w-full h-[400px] md:h-[600px] object-cover rounded-[2rem] md:rounded-[3.5rem] shadow-2xl transition-all"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-10 -right-6 md:-top-12 md:-right-12 z-20 scale-75 md:scale-100">
              <RotatingBadge />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-black py-4 overflow-hidden whitespace-nowrap border-y border-gray-800">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="flex space-x-12"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-white font-black text-2xl uppercase tracking-tighter">
              Welcome to ZARE – Premium Products at Best Prices
            </span>
          ))}
        </motion.div>
      </div>

      {/* Trending Section - Navigation Buttons */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-[200px] md:max-w-none"
            >
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 md:mb-4">Trending Now</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">Coveted Classics</h2>
            </motion.div>

            <div className="flex space-x-2 md:space-x-4">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-200 flex items-center justify-center bg-white text-black hover:bg-black hover:text-white transition-all active:scale-90"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black text-white flex items-center justify-center hover:bg-lime-400 hover:text-black transition-all active:scale-90 shadow-lg"
                aria-label="Scroll Right"
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 md:space-x-8 overflow-x-auto pb-8 md:pb-12 scroll-smooth no-scrollbar snap-x snap-mandatory px-0"
          >
            {trending.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[280px] sm:min-w-[340px] md:min-w-[400px] snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-32 px-4 bg-[#111] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] font-black uppercase text-lime-400 tracking-widest block mb-4">Craftsmanship</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">THE ART OF <br /> MINIMALISM.</h2>
              <p className="text-gray-400 text-xl leading-relaxed mt-8">
                In a world of noise, we choose silence. Our design process starts with the removal of the unnecessary, leaving only what matters: quality, comfort, and timeless form.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <h4 className="text-3xl font-black text-white mb-2">240+</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hand-stitched Details</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-white mb-2">100%</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organic Cotton</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop" 
                className="rounded-[3rem] w-full h-[600px] object-cover" 
                alt="Craft" 
              />
              <div className="absolute top-12 -right-12 w-48 h-48 bg-lime-400 rounded-full flex items-center justify-center p-8 text-black text-center rotate-12 hidden md:flex">
                <span className="text-xs font-black uppercase tracking-tighter">Premium Quality Guaranteed</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-32 px-4 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-12">
              FUELING FASHION ASPIRATIONS, OUR PLATFORM EMBODIES <span className="text-lime-500">STYLE EVOLUTION.</span>
            </h2>
            <Link to="/products" className="inline-flex items-center space-x-3 bg-lime-400 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
              <span>View All Collections</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 md:py-24 px-4 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 md:mb-16 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-4">Discover More</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Curated Collections</h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5', color: 'bg-stone-100', delay: 0 },
              { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', color: 'bg-slate-100', delay: 0.1 },
              { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', color: 'bg-zinc-100', delay: 0.2 }
            ].map((cat) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: cat.delay, duration: 0.6 }}
                className={`group relative overflow-hidden rounded-[2.5rem] h-[500px] md:h-[640px] ${cat.color} cursor-pointer shadow-sm`}
                onClick={() => navigate(`/products?cat=${cat.name}`)}
              >
                <img 
                  src={`${cat.image}?q=80&w=800&auto=format&fit=crop`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={cat.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute inset-x-0 bottom-0 p-12 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-lime-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4 block">New Season</span>
                  <h3 className="text-5xl font-black tracking-tighter text-white mb-8">{cat.name}</h3>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all shadow-xl">
                      <ArrowRight size={20} />
                    </div>
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-100">Browse collection</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Drops Section */}
      <section className="py-20 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-4">New Season</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">The New Arrivals</h2>
            <div className="w-24 h-1 bg-lime-400 mx-auto rounded-full"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-8 md:gap-y-20">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1, duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <Link to="/products" className="group inline-flex items-center space-x-4 bg-black text-white px-12 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:bg-lime-400 hover:text-black transition-all">
              <span>View Full Collection</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section with Scroll Effect */}
      <section className="py-32 px-4 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <div className="absolute -inset-4 border-2 border-lime-400/30 rounded-[4rem] -z-10 rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
              alt="Our Story" 
              className="rounded-[3.5rem] shadow-2xl w-full grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute -bottom-10 -right-10 bg-lime-400 text-black p-10 rounded-[3rem] hidden md:block rotate-12">
              <span className="text-6xl font-black tracking-tighter block mb-2">100%</span>
              <span className="text-xs font-black uppercase tracking-widest">Ethically Sourced</span>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-10"
          >
            <span className="text-[10px] font-black uppercase text-lime-400 tracking-widest">The Philosophy</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Crafted with <br /> <span className="text-gray-600 italic font-medium">Soul & Purpose.</span></h2>
            <p className="text-gray-400 text-xl leading-relaxed max-w-lg">
              "We don't just sell clothes; we curate a lifestyle. Every thread is selected to ensure longevity, and every cut is designed to empower your personality."
            </p>
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center">
                <Play size={16} fill="#A3E635" className="text-lime-400" />
              </div>
              <span className="font-black uppercase text-xs tracking-widest underline decoration-lime-400 underline-offset-8 cursor-pointer hover:text-lime-400 transition-colors">Hear Our Story</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: 'Global Delivery', desc: 'Secure worldwide shipping at your doorstep.', icon: <Globe size={32} /> },
            { title: 'Luxury Quality', desc: 'Each piece undergoes 24 strict quality checks.', icon: <Sparkles size={32} /> },
            { title: 'Secure Payment', desc: 'Your data is protected by industry-standard encryption.', icon: <ShieldCheck size={32} /> }
          ].map((benefit, i) => (
            <motion.div 
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-[#F3F3F3] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 group-hover:bg-lime-400 group-hover:scale-110 transition-all duration-500">
                {benefit.icon}
              </div>
              <h4 className="text-2xl font-black tracking-tighter mb-4">{benefit.title}</h4>
              <p className="text-gray-500 text-sm max-w-[250px] mx-auto">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 bg-[#F9F9F9] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-4">Voice of the Tribe</span>
            <h2 className="text-6xl font-black tracking-tighter">Trusted by Thousands</h2>
          </div>
          
          <div className="flex flex-wrap -mx-4">
            {[
              { name: 'Sarah J.', text: 'Absolutely love the quality. The fit is perfect and the materials feel incredibly premium!', rating: 5 },
              { name: 'Mike R.', text: 'Fast shipping and amazing customer service. Definitely my new go-to for essentials.', rating: 5 },
              { name: 'Emily D.', text: 'The minimalism I was looking for. Timeless pieces that actually last.', rating: 5 }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-full md:w-1/3 px-4 mb-8"
              >
                <div className="h-full p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
                  <div className="flex mb-6 text-lime-500">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-xl font-medium mb-10 leading-relaxed text-gray-800">"{t.text}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-lime-100 border border-lime-200"></div>
                    <div>
                      <span className="font-black text-sm block uppercase tracking-wider">{t.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-4 bg-lime-300 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">
              STAY IN <br className="hidden md:block" /> THE LOOP.
            </h2>
            <p className="text-black/60 max-w-xl mx-auto mb-16 text-xl font-medium">
              Join our newsletter for early access to collection drops, exclusive styling events, and limited run items.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 max-w-2xl mx-auto bg-white p-2 rounded-[2.5rem] md:rounded-full shadow-2xl">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="flex-1 w-full px-8 py-4 outline-none font-bold text-lg rounded-[2rem] md:rounded-full text-center md:text-left"
              />
              <button className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-[2rem] md:rounded-full font-black uppercase text-xs tracking-widest hover:bg-lime-500 hover:text-black transition-all">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </section>
    </div>
  );
}
