import React from 'react';
import { motion } from 'framer-motion';

export const Introduction: React.FC = () => {
  return (
    <section
      id="introduction"
      className="py-24 sm:py-32 border-t border-slate-200/60 bg-white/50 relative"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Large Editorial Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold block mb-4">
              Core Conviction
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 leading-[1.2] tracking-tight">
              Hope grows when people come together.
            </h2>
          </motion.div>

          {/* Dignified Narrative Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 flex flex-col gap-6 text-slate-600 text-base sm:text-lg font-light leading-relaxed"
          >
            <p>
              Hope Together Organization is an indigenous humanitarian collective rooted in the resilient valleys and communities of Khyber Pakhtunkhwa, Pakistan.
            </p>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              We believe sustainable dignity is not gifted from afar—it is cultivated from within. By listening to local families, honoring community wisdom, and facilitating collaborative action, we nurture enduring pathways for self-reliance and progress.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <span className="h-[1px] w-12 bg-slate-200" aria-hidden="true" />
              <span className="text-xs tracking-widest uppercase font-semibold text-slate-400">
                Khyber Pakhtunkhwa, Pakistan
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
