import React from 'react';
import { motion } from 'framer-motion';
import { partnerCategoriesData } from '../data/partners';
import { PartnerItem } from './PartnerItem';

export const Partners: React.FC = () => {
  return (
    <section id="partners" className="py-24 border-t border-slate-200/60 bg-white/60">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold block mb-2">
            Alliances
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Our Partners
          </h2>
          <p className="text-sm text-slate-500 font-light mt-2">
            Meaningful change grows through collaboration.
          </p>
        </motion.div>

        {/* Architectural Monochrome Partner Slots */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {partnerCategoriesData.map((partner) => (
            <PartnerItem key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};
