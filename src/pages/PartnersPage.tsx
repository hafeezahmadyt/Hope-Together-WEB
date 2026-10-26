import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Landmark, GraduationCap, Globe, Handshake } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { PartnerItem } from '../components/PartnerItem';
import { partnerService } from '../services/partnerService';
import { AdminPartner } from '../types/admin';

export const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<AdminPartner[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadPartners = async () => {
      try {
        const data = await partnerService.getPartners();
        if (isMounted) {
          setPartners(data);
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

  const categoryDetails = [
    {
      category: 'Community Partners',
      icon: Users,
      description: 'Grassroots community networks, village elders, and local advocacy bodies.',
      color: 'blue',
    },
    {
      category: 'Institutional Partners',
      icon: Landmark,
      description: 'Public sector collaborations, social welfare departments, and institutional bodies.',
      color: 'green',
    },
    {
      category: 'Education Partners',
      icon: GraduationCap,
      description: 'Universities, vocational training centers, and skill enhancement academies.',
      color: 'blue',
    },
    {
      category: 'Development Partners',
      icon: Globe,
      description: 'Regional and international development agencies and humanitarian coalitions.',
      color: 'green',
    },
  ];

  return (
    <>
      <SEO
        title="Partners | Hope Together Organization"
        description="Collaborating with community, institutional, educational, and development partners to foster enduring impact in Khyber Pakhtunkhwa, Pakistan."
      />

      {/* Page Hero */}
      <PageHero
        badge="Alliances"
        title="Together, We Create"
        highlightedWord="Greater Impact"
        description="Meaningful change grows through collaboration."
        accentColor="blue"
      />

      {/* Introduction Narrative */}
      <section className="py-16 bg-[#FAF9F6] border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Hope Together Organization works hand-in-hand with aligned organizations, local leadership,
            and academic institutions. Our partnership architecture ensures complete transparency,
            shared responsibility, and mutual respect.
          </p>
        </div>
      </section>

      {/* Overview Grid / Category Sections */}
      <section className="py-20 sm:py-28 bg-white/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-20">
          {categoryDetails.map((cat, idx) => {
            const Icon = cat.icon;
            const isGreen = cat.color === 'green';
            const iconColor = isGreen ? 'text-[#16A34A] bg-emerald-50' : 'text-[#1D70B8] bg-blue-50';
            const categoryPartners = partners
              .filter((p) => p.category === cat.category && p.isActive !== false)
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-light text-slate-900 tracking-tight">
                        {cat.category}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-light">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider self-start sm:self-auto">
                    {categoryPartners.length} {categoryPartners.length === 1 ? 'Partner' : 'Partners'}
                  </span>
                </div>

                {/* Partner Grid or Empty State */}
                {categoryPartners.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                    {categoryPartners.map((partner) => (
                      <PartnerItem key={partner.id} partner={partner} />
                    ))}
                  </div>
                ) : (
                  <div className="py-10 px-6 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-400 font-light">
                      No partners currently listed in {cat.category}.
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Partner Onboarding / Collaboration Callout */}
      <section className="py-20 sm:py-24 bg-[#FAF9F6] border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
            <div className="max-w-xl">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 text-[#1D70B8]">
                <Handshake className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Join Our Coalition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mb-3">
                Become an Organizational Partner
              </h2>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                We welcome inquiries from NGOs, institutional sponsors, and community foundations
                seeking transparent, grounded collaboration in Khyber Pakhtunkhwa.
              </p>
            </div>
            <Link
              to="/contact#get-involved"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-all flex-shrink-0"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
