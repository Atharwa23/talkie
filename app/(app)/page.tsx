'use client';

import React from 'react';
import { Mail, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import messages from '../messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-200 selection:bg-indigo-500/30">
      
      {/* Abstract Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-24 py-20 relative z-10">
        
        {/* Hero Section */}
        <motion.section 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center max-w-4xl mb-16"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6"
          >
            <ShieldCheck size={14} />
            100% Encrypted & Anonymous
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent"
          >
            Whisper in the <br /> 
            <span className="text-indigo-400">Digital Void.</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            True Feedback allows you to send and receive messages without a trace. Your identity is your own business.
          </motion.p>
        </motion.section>

        {/* Carousel Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-2xl relative"
        >
          {/* Decorative "Blur" behind carousel */}
          <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-3xl" />

          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md transition-all hover:border-indigo-500/30 hover:bg-white/[0.05]">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">{message.title}</h3>
                        <p className="text-slate-400 leading-relaxed mb-4">{message.content}</p>
                        <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                          Received: {message.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        {/* CTA Section */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2"
        >
          <Zap size={18} fill="currentColor" />
          Start Chatting Now
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-sm text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} True Feedback. Built for the anonymous world.
        </p>
      </footer>
    </div>
  );
}