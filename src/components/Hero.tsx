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
      {/* Dynamic Ambient Color Backdrop (Authentic Logo Colors Blending Together & Blending Away) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Clean canvas radial diffusion base */}
        <div className="absolute inset-0 bg-radial from-transparent via-white/40 to-[#FAF9F6]" />

        {/* Ambient Glowing Logo Colors Container with Enhanced Blur & Convergence/Divergence */}
        <div className="absolute inset-0 overflow-hidden mix-blend-multiply opacity-90 pointer-events-none">
          {/* 1. Primary Hope Blue Mass (Strong, Bold & Vibrant Presence) */}
          <motion.div
            animate={{
              // Starts separate on the right -> converges to center (blends with green) -> blooms -> diverges to left (blends away) -> returns to center -> returns to right
              x: [130, 20, 0, -25, -140, -40, 0, 80, 130],
              y: [-40, -15, 0, 15, 50, 20, 0, -25, -40],
              scale: [0.95, 1.12, 1.25, 1.15, 0.90, 1.08, 1.20, 1.02, 0.95],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] sm:w-[50rem] h-[36rem] sm:h-[50rem] rounded-full blur-[130px] sm:blur-[180px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(29, 112, 184, 0.75) 0%, rgba(2, 132, 199, 0.52) 38%, rgba(56, 189, 248, 0.22) 60%, transparent 76%)',
            }}
          />

          {/* 2. Primary Growth Green Mass (Counter-phase convergence & divergence) */}
          <motion.div
            animate={{
              // Starts separate on the left -> converges to center (blends with blue) -> blooms -> diverges to right (blends away) -> returns to center -> returns to left
              x: [-130, -20, 0, 25, 140, 40, 0, -80, -130],
              y: [40, 15, 0, -15, -50, -20, 0, 25, 40],
              scale: [0.95, 1.12, 1.25, 1.15, 0.90, 1.08, 1.20, 1.02, 0.95],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] sm:w-[50rem] h-[36rem] sm:h-[50rem] rounded-full blur-[130px] sm:blur-[180px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(22, 163, 74, 0.70) 0%, rgba(34, 197, 94, 0.46) 38%, rgba(74, 222, 128, 0.18) 60%, transparent 76%)',
            }}
          />

          {/* 3. Deep Cobalt & Sky Blue Reinforcement (Guarantees Equal Blue Dominance) */}
          <motion.div
            animate={{
              x: [80, -15, 0, 30, -110, 0, 80],
              y: [-30, 20, 0, -20, 40, -10, -30],
              scale: [1, 1.15, 1.22, 0.92, 1.10, 1.18, 1],
              opacity: [0.75, 0.95, 1, 0.7, 0.9, 0.98, 0.75],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[44rem] h-[32rem] sm:h-[44rem] rounded-full blur-[120px] sm:blur-[170px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(2, 132, 199, 0.70) 0%, rgba(29, 112, 184, 0.50) 42%, rgba(14, 165, 233, 0.20) 65%, transparent 78%)',
            }}
          />

          {/* 4. Emerald & Mint Reinforcement */}
          <motion.div
            animate={{
              x: [-80, 15, 0, -30, 110, 0, -80],
              y: [30, -20, 0, 20, -40, 10, 30],
              scale: [1, 1.15, 1.22, 0.92, 1.10, 1.18, 1],
              opacity: [0.75, 0.95, 1, 0.7, 0.9, 0.98, 0.75],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[44rem] h-[32rem] sm:h-[44rem] rounded-full blur-[120px] sm:blur-[170px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.62) 0%, rgba(22, 163, 74, 0.42) 42%, rgba(34, 197, 94, 0.18) 65%, transparent 78%)',
            }}
          />

          {/* 5. Central Dynamic Confluence Core (Blends directly behind "HOPE Together ORGANIZATION") */}
          <motion.div
            animate={{
              scale: [0.85, 1.20, 1.35, 0.90, 1.25, 0.85],
              opacity: [0.55, 0.95, 1, 0.5, 0.92, 0.55],
              rotate: [0, 45, 90, 180, 270, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] sm:w-[34rem] h-[24rem] sm:h-[34rem] rounded-full blur-[100px] sm:blur-[140px] will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(29, 112, 184, 0.55) 0%, rgba(2, 132, 199, 0.40) 30%, rgba(22, 163, 74, 0.45) 55%, transparent 75%)',
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
