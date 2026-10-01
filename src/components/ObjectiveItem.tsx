import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers } from 'lucide-react';
import { Objective } from '../types';

interface ObjectiveItemProps {
  objective: Objective;
  index: number;
}

export const ObjectiveItem: React.FC<ObjectiveItemProps> = ({ objective, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const isGreen = objective.accentColor === 'green';
  const hoverTextColor = isGreen ? 'group-hover:text-[#16A34A]' : 'group-hover:text-[#1D70B8]';
  const accentBadgeBg = isGreen ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#E0F2FE] text-[#0369A1]';
  const focusPillBg = 'bg-slate-100 text-slate-700 hover:bg-slate-200/80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white/70 hover:bg-white transition-all duration-300 border border-slate-200/70 hover:border-slate-300 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Number and Title */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
                {objective.number} / Objective
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase ${accentBadgeBg}`}
              >
                Active Mandate
              </span>
            </div>
            <h3
              className={`text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight transition-colors duration-200 ${hoverTextColor}`}
            >
              {objective.title}
            </h3>
          </div>
        </div>

        {/* Right Column: Narrative Description and Expandable Focus Areas */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed mb-6">
            {objective.description}
          </p>

          {/* Focus Areas Interactive Container */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-slate-500 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded"
                aria-expanded={isExpanded}
                aria-controls={`focus-areas-${objective.id}`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {objective.focusAreas.length === 1 ? 'Focus Area' : 'Focus Areas'} ({objective.focusAreas.length})
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-400 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id={`focus-areas-${objective.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-1">
                    {objective.focusAreas.map((area) => (
                      <span
                        key={area}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${focusPillBg}`}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
