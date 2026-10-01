import React from 'react';
import { motion } from 'framer-motion';
import { objectivesData } from '../data/objectives';
import { ObjectiveItem } from './ObjectiveItem';

export const CoreObjectives: React.FC = () => {
  return (
    <section id="objectives" className="py-24 sm:py-32 bg-[#FAF9F6] relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#16A34A] font-semibold block mb-3">
              Our Mandate
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Our Core Objectives
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-light leading-relaxed">
              Working with communities to create opportunities, strengthen rights, and build a more resilient future.
            </p>
          </motion.div>
        </div>

        {/* Four Editorial Factual Objectives */}
        <div className="space-y-6">
          {objectivesData.map((objective, index) => (
            <ObjectiveItem key={objective.id} objective={objective} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
