import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AboutPreview: React.FC = () => {
  return (
    <div
      id="about"
      className="p-8 sm:p-10 rounded-3xl bg-white/70 border border-slate-200/70 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold block mb-3">
          About Us
        </span>
        <h3 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mb-4">
          About Hope Together Organization
        </h3>
        <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-6">
          Founded on the belief that enduring transformation begins at the grassroots level,
          Hope Together Organization works hand-in-hand with families and local leadership to
          strengthen communities across Khyber Pakhtunkhwa. Our forthcoming narrative documents
          our origins, governance charter, and transparent approach to collective impact.
        </p>
      </motion.div>

      <div className="pt-2">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-[#1D70B8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded"
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
