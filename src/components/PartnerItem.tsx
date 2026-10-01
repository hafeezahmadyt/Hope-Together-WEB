import React from 'react';
import { Users, Landmark, GraduationCap, Globe, Building } from 'lucide-react';
import { Partner } from '../types';

interface PartnerItemProps {
  partner: Partner;
}

export const PartnerItem: React.FC<PartnerItemProps> = ({ partner }) => {
  // Select an appropriate subtle icon placeholder based on category or default
  const renderIconPlaceholder = () => {
    switch (partner.category) {
      case 'Community Partners':
        return <Users className="w-8 h-8 text-slate-400 group-hover:text-[#1D70B8] transition-colors mb-3" />;
      case 'Institutional Partners':
        return <Landmark className="w-8 h-8 text-slate-400 group-hover:text-[#16A34A] transition-colors mb-3" />;
      case 'Education Partners':
        return <GraduationCap className="w-8 h-8 text-slate-400 group-hover:text-[#1D70B8] transition-colors mb-3" />;
      case 'Development Partners':
        return <Globe className="w-8 h-8 text-slate-400 group-hover:text-[#16A34A] transition-colors mb-3" />;
      default:
        return <Building className="w-8 h-8 text-slate-400 group-hover:text-slate-600 transition-colors mb-3" />;
    }
  };

  const Content = (
    <div className="p-6 sm:p-8 rounded-2xl bg-white/80 border border-slate-200/60 flex flex-col items-center justify-center text-center group hover:border-slate-300 hover:shadow-sm transition-all duration-200 h-full">
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-12 w-auto max-w-[140px] object-contain filter grayscale group-hover:grayscale-0 transition-all mb-3"
        />
      ) : (
        renderIconPlaceholder()
      )}

      <span className="text-xs font-semibold text-slate-800 tracking-wide uppercase">
        {partner.name}
      </span>

      {partner.categorySubtitle && (
        <span className="text-[11px] text-slate-400 mt-1 font-mono">
          {partner.categorySubtitle}
        </span>
      )}
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded-2xl"
      >
        {Content}
      </a>
    );
  }

  return <div>{Content}</div>;
};
