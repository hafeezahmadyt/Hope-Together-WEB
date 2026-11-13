import React from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[96vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden pt-28 pb-16 bg-[#FAF9F6]"
    >
      {/* Dynamic Ambient Color Backdrop (Authentic Logo Colors Floating Behind Typography) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Subtle canvas base gradient */}
        <div className="absolute inset-0 bg-radial from-transparent via-white/50 to-[#FAF9F6]" />

        {/* Ambient Glowing Logo Colors Container */}
        <div className="absolute inset-0 overflow-hidden mix-blend-multiply opacity-85 pointer-events-none">
          {/* 1. Official Hope Blue Orb - Drifts freely around the top & right */}
          <motion.div
            animate={{
              x: [0, 55, -40, 30, -50, 35, 0],
              y: [0, -45, 30, -35, 45, -20, 0],
              scale: [1, 1.16, 0.92, 1.10, 0.95, 1.12, 1],
              rotate: [0, 40, -35, 55, -20, 15, 0],
            }}
            transition={{
              duration: 21,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[32%] left-[54%] -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[42rem] h-[30rem] sm:h-[42rem] rounded-full blur-[95px] sm:blur-[125px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(29, 112, 184, 0.55) 0%, rgba(2, 132, 199, 0.35) 45%, rgba(56, 189, 248, 0.15) 65%, transparent 80%)',
            }}
          />

          {/* 2. Official Hope Green Orb - Drifts freely around the center & left */}
          <motion.div
            animate={{
              x: [0, -50, 35, -55, 30, -25, 0],
              y: [0, 40, -50, 25, -40, 30, 0],
              scale: [1, 0.90, 1.18, 0.94, 1.14, 1.02, 1],
              rotate: [0, -45, 35, -30, 40, -10, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[36%] left-[44%] -translate-x-1/2 -translate-y-1/2 w-[28rem] sm:w-[40rem] h-[28rem] sm:h-[40rem] rounded-full blur-[100px] sm:blur-[130px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(22, 163, 74, 0.50) 0%, rgba(34, 197, 94, 0.32) 45%, rgba(74, 222, 128, 0.15) 65%, transparent 80%)',
            }}
          />

          {/* 3. Luminous Cyan / Sky Accent - Swirls randomly across the upper center */}
          <motion.div
            animate={{
              x: [0, 40, -30, 50, -35, 20, 0],
              y: [0, -30, 40, -20, 30, -40, 0],
              scale: [1.05, 0.92, 1.15, 1, 0.94, 1.08, 1.05],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[28%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-[24rem] sm:w-[34rem] h-[24rem] sm:h-[34rem] rounded-full blur-[85px] sm:blur-[115px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(2, 132, 199, 0.45) 0%, rgba(14, 165, 233, 0.28) 45%, transparent 75%)',
            }}
          />

          {/* 4. Fresh Mint / Emerald Accent - Drifts gently lower behind ORGANIZATION */}
          <motion.div
            animate={{
              x: [0, -35, 45, -20, 40, -45, 0],
              y: [0, 30, -35, 45, -25, 20, 0],
              scale: [0.95, 1.12, 0.96, 1.16, 0.92, 1.06, 0.95],
            }}
            transition={{
              duration: 23,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[44%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[26rem] sm:w-[36rem] h-[26rem] sm:h-[36rem] rounded-full blur-[95px] sm:blur-[125px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.42) 0%, rgba(22, 163, 74, 0.26) 50%, transparent 75%)',
            }}
          />

          {/* 5. Central Breathing Core - Unifies the green and blue directly behind the typography */}
          <motion.div
            animate={{
              x: [0, 25, -30, 20, -25, 0],
              y: [0, -20, 25, -30, 20, 0],
              scale: [1, 1.10, 0.93, 1.08, 0.96, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] sm:w-[30rem] h-[22rem] sm:h-[30rem] rounded-full blur-[75px] sm:blur-[100px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(29, 112, 184, 0.40) 0%, rgba(22, 163, 74, 0.35) 45%, transparent 72%)',
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xs">
            <img
              src={logoImg}
              alt="Hope Together Organization Emblem"
              className="h-6 w-auto object-contain"
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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 text-sm font-medium hover:bg-white hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 shadow-xs active:translate-y-0"
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
