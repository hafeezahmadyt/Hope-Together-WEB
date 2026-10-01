import React from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.jpg';
import logoImg from '../assets/logo.png';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[96vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden pt-28 pb-16"
    >
      {/* Atmospheric Photography & Ambient Lighting Backdrop */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <img
          src={heroBg}
          alt="Atmospheric documentary photography of communities in Khyber Pakhtunkhwa"
          className="w-full h-full object-cover object-center filter blur-[1.5px] scale-105 opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6]/85 to-[#FAF9F6]" />
        <div className="absolute inset-0 bg-radial from-transparent via-white/40 to-[#FAF9F6]" />

        {/* Ambient Glowing Orbs */}
        <div className="absolute inset-0 overflow-hidden mix-blend-multiply opacity-70">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full blur-[110px] animate-orb-1"
            style={{
              background:
                'radial-gradient(circle, rgba(29, 112, 184, 0.45) 0%, rgba(2, 132, 199, 0.25) 50%, transparent 75%)',
            }}
          />
          <div
            className="absolute top-1/3 left-1/4 w-[28rem] h-[28rem] rounded-full blur-[120px] animate-orb-2"
            style={{
              background:
                'radial-gradient(circle, rgba(22, 163, 74, 0.38) 0%, rgba(167, 243, 208, 0.2) 60%, transparent 80%)',
            }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-[32rem] h-[32rem] rounded-full blur-[130px] animate-orb-1"
            style={{
              background:
                'radial-gradient(circle, rgba(2, 132, 199, 0.35) 0%, rgba(29, 112, 184, 0.2) 50%, transparent 75%)',
            }}
          />
        </div>
      </div>

      {/* Editorial Centerpiece Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Subtle Brand Emblem Anchor */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-sm">
            <img
              src={logoImg}
              alt="Hope Together Organization Emblem"
              className="h-5 w-auto object-contain"
            />
            <span className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Khyber Pakhtunkhwa, Pakistan
            </span>
          </div>
        </motion.div>

        {/* Architectural Grand Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col items-center select-none mb-8 sm:mb-10 w-full max-w-5xl mx-auto px-2"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-none text-center flex flex-wrap items-baseline justify-center gap-3 sm:gap-4 m-0 p-0 uppercase">
            <span className="font-serif text-slate-950 font-black">HOPE</span>
            <span className="font-serif italic font-light tracking-normal text-[#1D70B8] lowercase first-letter:uppercase drop-shadow-sm">
              Together
            </span>
          </h1>
          <span className="tracking-[0.45em] sm:tracking-[0.55em] text-sm sm:text-lg md:text-xl font-bold text-slate-500 uppercase mt-4 sm:mt-5 text-center">
            ORGANIZATION
          </span>
        </motion.div>

        {/* Sincere Minimalist Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl md:text-2xl font-light text-slate-600 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed"
        >
          Together, we create hope.
        </motion.p>

        {/* Restrained Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
        >
          <a
            href="#objectives"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all duration-200 shadow-[0_4px_16px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore Our Work</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 text-sm font-medium hover:bg-white hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 shadow-sm active:translate-y-0"
          >
            <span>Get Involved</span>
          </a>
        </motion.div>

        {/* Subtle Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-16 sm:pt-20 hover:opacity-100 transition-opacity"
        >
          <a
            href="#introduction"
            className="inline-flex flex-col items-center gap-1.5 text-xs text-slate-500 font-medium tracking-wider uppercase hover:text-slate-800 transition-colors"
            aria-label="Scroll to introduction section"
          >
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
