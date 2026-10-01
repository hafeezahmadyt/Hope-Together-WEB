import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, CheckCircle2, ChevronDown, Layers, FileText } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { objectivesData } from '../data/objectives';

export const OurWorkPage: React.FC = () => {
  const [activeObjectiveId, setActiveObjectiveId] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setActiveObjectiveId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <SEO
        title="Our Work | Hope Together Organization"
        description="Creating opportunities, strengthening rights, and building resilient communities across Khyber Pakhtunkhwa, Pakistan through our four core objectives."
      />

      {/* Page Hero */}
      <PageHero
        badge="Strategic Pillars"
        title="Our"
        highlightedWord="Work"
        description="Creating opportunities, strengthening rights, and building resilient communities."
        accentColor="green"
      />

      {/* Editorial Major Sections */}
      <div className="py-16 sm:py-24 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-24 sm:space-y-32">
          {objectivesData.map((objective, idx) => {
            const isEven = idx % 2 === 1;
            const isGreen = objective.accentColor === 'green';
            const accentTextClass = isGreen ? 'text-[#16A34A]' : 'text-[#1D70B8]';
            const accentBgClass = isGreen ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#E0F2FE] text-[#0369A1]';
            const isOpen = activeObjectiveId === objective.id;

            return (
              <motion.article
                key={objective.id}
                id={objective.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className="scroll-mt-32"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}>
                  {/* Text Column */}
                  <div className={`lg:col-span-7 flex flex-col justify-center ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl sm:text-4xl font-mono font-light text-slate-300">
                        {objective.number}
                      </span>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${accentBgClass}`}>
                        Mandate Pillar
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-light text-slate-900 tracking-tight mb-5 leading-tight">
                      {objective.title}
                    </h2>

                    <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed mb-8">
                      {objective.description}
                    </p>

                    {/* Focus Areas */}
                    <div className="mb-8">
                      <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-3">
                        Designated Focus Areas
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {objective.focusAreas.map((area) => (
                          <div
                            key={area}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs"
                          >
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accentTextClass}`} />
                            <span className="text-xs sm:text-sm font-medium text-slate-700">
                              {area}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Exploration / Projects Placeholder Drawer */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleDetails(objective.id)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded py-1 transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={`details-${objective.id}`}
                      >
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span>{isOpen ? 'Close Project Archive' : 'Explore Initiative Framework'}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            id={`details-${objective.id}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-4"
                          >
                            <div className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 text-slate-600 text-xs sm:text-sm space-y-3 shadow-xs">
                              <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <FileText className="w-4 h-4 text-[#1D70B8]" />
                                <span>Initiative Documentation</span>
                              </div>
                              <p className="font-mono text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                                [Dedicated field projects, partner alliances, and regional documentation for {objective.title} will be listed here.]
                              </p>
                              <div className="text-[11px] text-slate-400">
                                Registered initiative under Hope Together Organization charter.
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Visual / Image Placeholder Column */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative rounded-3xl overflow-hidden bg-white/80 border border-slate-200/70 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] group hover:border-slate-300 transition-all">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform mb-4">
                        <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                        Field Photography
                      </span>
                      <p className="text-xs text-slate-400 font-mono max-w-xs leading-relaxed">
                        [High-resolution field documentation photography will be inserted here]
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-[11px] text-slate-400">
                        <span>Pillar {objective.number}</span>
                        <span>•</span>
                        <span>Khyber Pakhtunkhwa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Final Section Call to Action */}
      <section className="py-20 sm:py-24 bg-white border-t border-slate-200/60 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold block mb-3">
            Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight mb-4">
            Partner With Us on These Pillars
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Organizations, academic institutions, and grassroots volunteers are invited to collaborate on our core initiatives.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
            >
              <span>Explore Partners</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact#get-involved"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-100 text-slate-800 text-sm font-medium hover:bg-slate-200 transition-all"
            >
              <span>Get Involved</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
