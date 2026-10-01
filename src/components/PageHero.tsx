import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
  badge: string;
  title: string;
  highlightedWord?: string;
  description: string;
  accentColor?: 'blue' | 'green';
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  title,
  highlightedWord,
  description,
  accentColor = 'blue',
}) => {
  const badgeColorClass =
    accentColor === 'green'
      ? 'text-[#16A34A] border-green-200/60 bg-green-50/50'
      : 'text-[#1D70B8] border-blue-200/60 bg-blue-50/50';

  return (
    <section className="relative pt-36 pb-20 sm:pt-40 sm:pb-24 border-b border-slate-200/60 overflow-hidden bg-[#FAF9F6]">
      {/* Subtle ambient lighting backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[22rem] rounded-full blur-[100px] opacity-30"
          style={{
            background:
              accentColor === 'green'
                ? 'radial-gradient(circle, rgba(22, 163, 74, 0.35) 0%, rgba(167, 243, 208, 0.2) 60%, transparent 80%)'
                : 'radial-gradient(circle, rgba(29, 112, 184, 0.35) 0%, rgba(2, 132, 199, 0.2) 60%, transparent 80%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <span
            className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-[0.25em] uppercase border ${badgeColorClass}`}
          >
            {badge}
          </span>
        </motion.div>

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-light text-slate-900 tracking-tight leading-[1.15] mb-6 max-w-4xl"
        >
          {title}{' '}
          {highlightedWord && (
            <span className="font-serif italic text-[#1D70B8] font-normal block sm:inline mt-1 sm:mt-0">
              {highlightedWord}
            </span>
          )}
        </motion.h1>

        {/* Supporting Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl font-light text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
};
