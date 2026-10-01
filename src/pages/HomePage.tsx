import React from 'react';
import { SEO } from '../components/SEO';
import { Hero } from '../components/Hero';
import { Introduction } from '../components/Introduction';
import { CoreObjectives } from '../components/CoreObjectives';
import { Partners } from '../components/Partners';
import { AboutPreview } from '../components/AboutPreview';
import { TeamPreview } from '../components/TeamPreview';
import { FinalCTA } from '../components/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Hope Together Organization | Building Hope Together"
        description="Hope Together Organization works with communities to advance youth empowerment, women empowerment and protection, child rights, and environmental action in Khyber Pakhtunkhwa, Pakistan."
      />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Short Introduction */}
      <Introduction />

      {/* 4. Our Core Objectives */}
      <CoreObjectives />

      {/* 5. Our Partners */}
      <Partners />

      {/* 6. About Preview & 7. Team Preview */}
      <section className="py-24 bg-[#FAF9F6] border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <AboutPreview />
            <TeamPreview />
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action */}
      <FinalCTA />
    </>
  );
};
