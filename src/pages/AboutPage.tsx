import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Compass,
  Target,
  HeartHandshake,
  ShieldCheck,
  Megaphone,
  GraduationCap,
  LifeBuoy,
  Leaf,
  Scale,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { organizationalValues } from '../data/values';
import { methodologyItems } from '../data/methodology';

const methodologyIcons = [
  Megaphone,
  GraduationCap,
  LifeBuoy,
  Leaf,
  Scale,
];

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us | Hope Together Organization"
        description="Learn about Hope Together Organization, our mission, vision, values, and community-centered approach in Khyber Pakhtunkhwa, Pakistan."
      />

      {/* 1. Page Hero */}
      <PageHero
        badge="About Us"
        title="About Hope Together"
        highlightedWord="Organization"
        description="Building hope through collaboration, empowerment and community action."
        accentColor="blue"
      />

      {/* 2. Introduction: Who We Are */}
      <section className="py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold block mb-3">
                Identity
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight leading-tight">
                Who We Are
              </h2>
            </div>

            <div className="lg:col-span-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-white/80 border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <p className="text-slate-700 text-base sm:text-lg font-light leading-relaxed mb-4">
                  Hope Together Organization is an indigenous non-governmental organization registered and
                  operating in Khyber Pakhtunkhwa, Pakistan. We work closely alongside local communities
                  to foster sustainable development, social dignity, and grassroots empowerment.
                </p>
                <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                  Committed to the empowerment of youth, women, and children, particularly those from urban and marginalized communities, our organization executes community-led programs anchored in democratic citizenship, legal awareness, environmental resilience, and transparent stewardship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & 4. Vision */}
      <section className="py-20 sm:py-28 bg-white/60 border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-blue-100 hover:border-blue-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1D70B8] flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold block mb-2">
                  Mandate
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mb-4">
                  Mission Statement
                </h3>
                <p className="text-slate-700 text-base sm:text-lg font-light leading-relaxed">
                  Hope Together Organization is committed to the empowerment of youth, women, and children, particularly those from urban and marginalized communities.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-emerald-100 hover:border-emerald-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#16A34A] font-semibold block mb-2">
                  Horizon
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mb-4">
                  Vision Statement
                </h3>
                <p className="text-slate-700 text-base sm:text-lg font-light leading-relaxed">
                  The vision of Hope Together Organization is to establish a youth led society in which every individual regardless of gender, religion, caste, or background enjoys fundamental rights, equal opportunities, and protection from discrimination.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Our Values */}
      <section className="py-20 sm:py-28 bg-[#FAF9F6] border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold block mb-3">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight mb-3">
              Our Values
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
              The ethical compass directing every initiative and engagement across our communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {organizationalValues.map((val, idx) => (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-8 rounded-2xl bg-white/80 border border-slate-200/70 hover:border-slate-300 transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    {val.number} / Value
                  </span>
                  <HeartHandshake className="w-4 h-4 text-[#1D70B8]" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">
                  {val.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Approach / Methodology */}
      <section className="py-20 sm:py-28 bg-white/60 border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#1D70B8]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold">
                Methodology
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight mb-4">
              Our Approach
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed mb-4">
              Our collaborative operational framework and grassroots engagement procedures are centered on local community empowerment, transparent stewardship, and sustainable self reliance.
            </p>
            <p className="text-sm sm:text-base text-slate-500 font-light">
              Hope Together Organization executes its mission through a multifaceted, grassroots approach:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methodologyItems.map((item, idx) => {
              const IconComponent = methodologyIcons[idx % methodologyIcons.length];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 sm:p-7 rounded-2xl bg-white/80 border border-slate-200/70 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {item.number} / Pillar
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50/80 text-[#1D70B8] flex items-center justify-center">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 mb-2">
                      {item.tag}
                    </span>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/our-work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>View Core Objectives & Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-20 sm:py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-5">
            Let's Build Hope Together.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light max-w-lg mx-auto mb-8 leading-relaxed">
            Collaborate with us in advancing community dignity and empowerment across Khyber Pakhtunkhwa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/our-work"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-all shadow-md"
            >
              <span>Our Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
