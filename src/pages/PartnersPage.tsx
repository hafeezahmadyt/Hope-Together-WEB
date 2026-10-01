import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Landmark, GraduationCap, Globe, Handshake } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';

export const PartnersPage: React.FC = () => {
  const categoryDetails = [
    {
      category: 'Community Partners',
      icon: Users,
      description: 'Grassroots community networks, village elders, and local advocacy bodies.',
      color: 'blue',
      slots: 4,
    },
    {
      category: 'Institutional Partners',
      icon: Landmark,
      description: 'Public sector collaborations, social welfare departments, and institutional bodies.',
      color: 'green',
      slots: 4,
    },
    {
      category: 'Education Partners',
      icon: GraduationCap,
      description: 'Universities, vocational training centers, and skill enhancement academies.',
      color: 'blue',
      slots: 4,
    },
    {
      category: 'Development Partners',
      icon: Globe,
      description: 'Regional and international development agencies and humanitarian coalitions.',
      color: 'green',
      slots: 4,
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
                    Category {idx + 1}
                  </span>
                </div>

                {/* Elegant Minimalist Logo Wall Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: cat.slots }).map((_, slotIdx) => (
                    <div
                      key={slotIdx}
                      className="p-6 sm:p-8 rounded-2xl bg-white/80 border border-slate-200/60 hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col items-center justify-center text-center group min-h-[140px]"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <Icon className="w-4 h-4 opacity-70" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Partner Slot {slotIdx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono">
                        [Logo &amp; Credentials Pending]
                      </span>
                    </div>
                  ))}
                </div>
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
