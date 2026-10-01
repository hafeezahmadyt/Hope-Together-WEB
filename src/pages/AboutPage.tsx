import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Target, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { organizationalValues } from '../data/values';

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
                <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed mb-6">
                  Hope Together Organization is an indigenous non-governmental organization registered and
                  operating in Khyber Pakhtunkhwa, Pakistan. We work closely alongside local communities
                  to foster sustainable development, social dignity, and grassroots empowerment.
                </p>
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-dashed border-slate-300 text-slate-500 font-mono text-xs sm:text-sm">
                  [Official organization introduction will be added here.]
                </div>
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
                  Our Mission
                </h3>
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-dashed border-blue-200 text-slate-600 font-mono text-sm leading-relaxed">
                  [Official mission statement]
                </div>
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
                  Our Vision
                </h3>
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-dashed border-emerald-200 text-slate-600 font-mono text-sm leading-relaxed">
                  [Official vision statement]
                </div>
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
            <p className="text-slate-500 text-sm sm:text-base font-light">
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
                  <HeartHandshake className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">
                  {val.title}
                </h3>
                <p className="text-slate-500 font-mono text-xs sm:text-sm bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Approach */}
      <section className="py-20 sm:py-28 bg-white/60 border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white/80 border border-slate-200/70 shadow-sm flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#1D70B8]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold">
                  Methodology
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mb-4">
                Our Approach
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-4">
                Our collaborative operational framework and grassroots engagement procedures are
                centered on local community empowerment, transparent stewardship, and sustainable self-reliance.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs sm:text-sm text-slate-500 font-mono">
                [Detailed organizational methodology and operational guidelines will be added here.]
              </div>
            </div>
            <div className="flex-shrink-0 self-center md:self-start">
              <Link
                to="/our-work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>View Core Objectives</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
