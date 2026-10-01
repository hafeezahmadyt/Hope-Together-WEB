import React from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const TeamPreview: React.FC = () => {
  return (
    <div
      id="team"
      className="p-8 sm:p-10 rounded-3xl bg-white/70 border border-slate-200/70 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold block mb-3">
          The People
        </span>
        <h3 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mb-4">
          Meet the People Behind Hope
        </h3>
        <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-6">
          A dedicated collective of community advocates, field practitioners, and volunteers
          working together with mutual respect and unwavering dedication to the communities we
          serve across Khyber Pakhtunkhwa.
        </p>

        {/* Subtle placeholder indicator for real team roster */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/50 flex items-center gap-3 text-slate-500">
          <div className="w-8 h-8 rounded-full bg-slate-200/70 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xs font-light text-slate-500">
            Full governance board and field coordinator profiles will be presented here.
          </p>
        </div>
      </motion.div>

      <div className="pt-2">
        <Link
          to="/team"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue"
        >
          <span>Meet Our Team</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
