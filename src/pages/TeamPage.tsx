import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, HeartHandshake } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { TeamMemberCard } from '../components/TeamMemberCard';
import { teamCategories } from '../data/team';

export const TeamPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Team | Hope Together Organization"
        description="Meet the dedicated team, leadership, and grassroots volunteers behind Hope Together Organization in Khyber Pakhtunkhwa, Pakistan."
      />

      {/* Page Hero */}
      <PageHero
        badge="Our People"
        title="Meet the People"
        highlightedWord="Behind Hope"
        description="A community of people working together to create meaningful change."
        accentColor="blue"
      />

      {/* Context Narrative */}
      <section className="py-16 bg-[#FAF9F6] border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Our collective strength lies in the integrity, empathy, and localized insight of our
            leadership, field directors, and community volunteers across Khyber Pakhtunkhwa.
          </p>
        </div>
      </section>

      {/* Sections: Leadership, Team, Volunteers */}
      <div className="py-20 sm:py-28 bg-white/60 space-y-24 sm:space-y-32">
        {teamCategories.map((cat, idx) => {
          const isLeadership = cat.id === 'Leadership';
          const isTeam = cat.id === 'Team';
          const Icon = isLeadership ? Shield : isTeam ? Users : HeartHandshake;
          const accentColor = isLeadership ? 'text-[#1D70B8]' : isTeam ? 'text-[#16A34A]' : 'text-slate-700';

          return (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="max-w-6xl mx-auto px-6 sm:px-8"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/70">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${accentColor}`} />
                    <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">
                      Department
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-slate-500 font-light mt-1">
                    {cat.description}
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
                  [Official Roster Pending]
                </span>
              </div>

              {/* Grid of Team Member Cards (Structured Placeholders) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {Array.from({ length: cat.placeholderCount }).map((_, slotIdx) => (
                  <TeamMemberCard
                    key={slotIdx}
                    categoryName={cat.id}
                    index={slotIdx + 1}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Volunteer / Join Callout */}
      <section className="py-20 sm:py-24 bg-[#FAF9F6] border-t border-slate-200/60 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#16A34A] font-semibold block mb-3">
            Get Involved
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight mb-4">
            Join Our Volunteer Network
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Passionate individuals interested in contributing field time, professional skills, or
            educational mentoring are invited to register their interest.
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact#get-involved"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
            >
              <span>Volunteer With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
