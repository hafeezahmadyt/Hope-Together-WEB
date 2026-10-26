import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Play, Pause } from 'lucide-react';
import { PartnerItem } from './PartnerItem';
import { partnerService } from '../services/partnerService';
import { AdminPartner } from '../types/admin';

export const Partners: React.FC = () => {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadPartners = async () => {
      try {
        const data = await partnerService.getPartners();
        if (isMounted) {
          setPartners(
            data
              .filter((p) => p.isActive !== false)
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          );
        }
      } catch {
        // Fallback
      }
    };

    loadPartners();

    const handleUpdate = () => {
      loadPartners();
    };

    window.addEventListener('hope_together_partners_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('hope_together_partners_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Prepare a sequence of partners with enough items to span wide displays
  const displayPartners = partners.length > 0 ? partners : [];
  const repeatCount = displayPartners.length > 0 ? Math.max(1, Math.ceil(6 / displayPartners.length)) : 0;
  const singleSequence = Array.from({ length: repeatCount }, () => displayPartners).flat();
  // Keep card speed consistent regardless of partner count (~5.5s per item)
  const marqueeDuration = `${Math.max(25, singleSequence.length * 5.5)}s`;

  return (
    <section id="partners" className="py-24 border-t border-slate-200/60 bg-white/70 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold block mb-2">
            Alliances
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Our Partners
          </h2>
          <p className="text-sm text-slate-600 font-light mt-2">
            Meaningful change grows through collaboration with vibrant grassroots, academic, and community allies across Khyber Pakhtunkhwa.
          </p>
        </motion.div>
      </div>

      {/* Dynamic Animated Partner Marquee */}
      {displayPartners.length > 0 ? (
        <div className="relative w-full" data-marquee-paused={isPaused}>
          {/* Subtle edge fade gradients */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10" />

          {/* Infinite scrolling track */}
          <div className="overflow-hidden py-4 marquee-container">
            <div className="flex w-max">
              <div
                className="animate-marquee-smooth flex items-stretch gap-6 pr-6"
                style={{ animationDuration: marqueeDuration }}
              >
                {singleSequence.map((partner, idx) => (
                  <div
                    key={`${partner.id}-a-${idx}`}
                    className="w-[260px] sm:w-[290px] flex-shrink-0 flex flex-col"
                  >
                    <PartnerItem
                      partner={partner}
                      isDuplicate={idx >= displayPartners.length}
                    />
                  </div>
                ))}
              </div>
              <div
                className="animate-marquee-smooth flex items-stretch gap-6 pr-6"
                aria-hidden="true"
                style={{ animationDuration: marqueeDuration }}
              >
                {singleSequence.map((partner, idx) => (
                  <div
                    key={`${partner.id}-b-${idx}`}
                    className="w-[260px] sm:w-[290px] flex-shrink-0 flex flex-col"
                  >
                    <PartnerItem partner={partner} isDuplicate />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue"
              aria-label={isPaused ? 'Resume moving partner logos' : 'Pause moving partner logos'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Resume Motion</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pause Motion</span>
                </>
              )}
            </button>

            <span className="text-xs text-slate-500 font-light">
              Hover to pause • Click linked partners to visit official websites
            </span>

            <span className="hidden sm:inline text-slate-300">•</span>

            <Link
              to="/partners"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D70B8] hover:underline"
            >
              <span>View All Categories & Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="p-8 rounded-3xl bg-slate-50/60 border border-dashed border-slate-200">
            <Handshake className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-light mb-3">
              We collaborate with community networks, academic centers, and development allies.
            </p>
            <Link
              to="/partners"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D70B8] hover:underline"
            >
              <span>Explore Partnership Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
