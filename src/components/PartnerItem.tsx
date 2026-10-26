import React from 'react';
import { Users, Landmark, GraduationCap, Globe, Building } from 'lucide-react';
import { Partner } from '../types';
import { AdminPartner } from '../types/admin';

interface PartnerItemProps {
  partner: Partner | AdminPartner;
  isDuplicate?: boolean;
}

export const PartnerItem: React.FC<PartnerItemProps> = ({ partner, isDuplicate }) => {
  const logo = ('logo' in partner ? partner.logo : undefined) || ('logoUrl' in partner ? partner.logoUrl : undefined);

  // Select an appropriate subtle icon placeholder based on category or default
  const renderIconPlaceholder = () => {
    switch (partner.category) {
      case 'Community Partners':
        return (
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1D70B8] flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <Users className="w-8 h-8" />
          </div>
        );
      case 'Institutional Partners':
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
            <Landmark className="w-8 h-8" />
          </div>
        );
      case 'Education Partners':
        return (
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
            <GraduationCap className="w-8 h-8" />
          </div>
        );
      case 'Development Partners':
        return (
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
            <Globe className="w-8 h-8" />
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
            <Building className="w-8 h-8" />
          </div>
        );
    }
  };

  const Content = (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between text-center group h-full min-h-[200px] sm:min-h-[220px]">
      <div className="w-full flex-1 flex items-center justify-center">
        {logo ? (
          <div className="w-full flex items-center justify-center h-24 sm:h-28 px-2">
            <img
              src={logo}
              alt={partner.name}
              className="max-h-full max-w-full w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          renderIconPlaceholder()
        )}
      </div>

      <div className="w-full mt-3 pt-2 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-800 tracking-wide uppercase line-clamp-2 block">
          {partner.name}
        </span>

        {partner.categorySubtitle && (
          <span className="text-[11px] text-slate-500 mt-0.5 block font-light">
            {partner.categorySubtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isDuplicate ? -1 : undefined}
        aria-hidden={isDuplicate ? true : undefined}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded-3xl"
      >
        {Content}
      </a>
    );
  }

  return (
    <div className="h-full" aria-hidden={isDuplicate ? true : undefined}>
      {Content}
    </div>
  );
};
