import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import logoWhite from '../assets/logo-white.png';

export const FinalCTA: React.FC = () => {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Atmospheric subtle gradients & lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[26rem] rounded-full blur-[100px] pointer-events-none animate-ambient-glow opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(20, 184, 166, 0.3) 50%, rgba(22, 163, 74, 0.25) 100%)',
        }}
      />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#1D70B8]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#16A34A]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Emblem badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-8"
        >
          <img
            src={logoWhite}
            alt="Hope Together Organization Emblem"
            className="w-8 h-8 object-contain"
          />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight mb-6"
        >
          Hope Starts With Us.
          <br />
          <span className="font-serif italic text-sky-300">It Grows Together.</span>
        </motion.h2>

        {/* Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-slate-300 text-base sm:text-lg font-light max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Whether you are seeking partnership, wishing to volunteer skills, or wanting to
          support our grassroots mission, we welcome your presence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="mailto:contact@hopetogether.org.pk?subject=Get%20Involved%20-%20Hope%20Together%20Organization"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            <span>Get Involved</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="mailto:info@hopetogether.org.pk?subject=Inquiry%20-%20Hope%20Together%20Organization"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Mail className="w-4 h-4 text-slate-300" />
            <span>Contact Us</span>
          </a>
        </motion.div>

        {/* Geographical and Institutional Note */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 text-xs text-slate-400 font-light flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <span>Khyber Pakhtunkhwa, Pakistan</span>
          <span className="hidden sm:inline">•</span>
          <span>Registered Humanitarian Organization</span>
        </div>
      </div>
    </section>
  );
};
