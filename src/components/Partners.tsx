import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake } from 'lucide-react';
import { PartnerItem } from './PartnerItem';
import { partnerService } from '../services/partnerService';
import { AdminPartner } from '../types/admin';

export const Partners: React.FC = () => {
  const [partners, setPartners] = useState<AdminPartner[]>([]);

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
            Meaningful change grows through collaboration across Khyber Pakhtunkhwa.
          </p>
        </motion.div>

        {/* Dynamic Partner Grid */}
        {partners.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {partners.slice(0, 8).map((partner) => (
              <PartnerItem key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-50/60 border border-dashed border-slate-200 text-center max-w-md mx-auto">
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
        )}
      </div>
    </section>
  );
};
