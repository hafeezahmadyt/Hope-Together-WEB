import React from 'react';
import { User, Linkedin, Twitter, Mail } from 'lucide-react';
import { TeamMember } from '../types';

interface TeamMemberCardProps {
  member?: TeamMember;
  placeholderRole?: string;
  categoryName?: string;
  index?: number;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  placeholderRole = 'Role Title',
  categoryName = 'Team',
  index = 1,
}) => {
  if (member) {
    return (
      <div className="p-6 rounded-3xl bg-white/80 border border-slate-200/70 hover:border-slate-300 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md flex flex-col justify-between h-full group">
        <div>
          {/* Photograph Container */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-5 relative flex items-center justify-center">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <User className="w-10 h-10 mb-1" />
                <span className="text-[11px] font-mono">[Official Photo]</span>
              </div>
            )}
          </div>

          <span className="text-[11px] font-semibold text-[#1D70B8] uppercase tracking-wider block mb-1">
            {member.position}
          </span>
          <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">
            {member.name}
          </h3>

          {member.bio && (
            <p className="text-slate-600 text-sm font-light leading-relaxed mb-4">
              {member.bio}
            </p>
          )}
        </div>

        {member.socialLinks && member.socialLinks.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-slate-400">
            {member.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition-colors p-1"
                aria-label={`${member.name} on ${link.platform}`}
              >
                {link.platform.toLowerCase() === 'linkedin' ? (
                  <Linkedin className="w-4 h-4" />
                ) : link.platform.toLowerCase() === 'twitter' ? (
                  <Twitter className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Elegant Structured Placeholder Card
  return (
    <div className="p-6 rounded-3xl bg-white/70 border border-slate-200/70 hover:border-slate-300 transition-all duration-300 shadow-xs flex flex-col justify-between h-full group">
      <div>
        {/* Placeholder Photo Area */}
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-dashed border-slate-200 mb-5 relative flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mb-2 text-slate-400 group-hover:text-slate-600 transition-colors">
            <User className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            [Photograph Slot]
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
            {categoryName} {index}
          </span>
          <span className="text-[10px] font-semibold text-[#1D70B8] uppercase tracking-wider">
            [{placeholderRole}]
          </span>
        </div>

        <h3 className="text-lg font-medium text-slate-800 mb-2 tracking-tight">
          [Official Member Name]
        </h3>

        <p className="text-xs text-slate-500 font-mono bg-slate-50/80 p-3 rounded-xl border border-dashed border-slate-200 leading-relaxed mb-4">
          [Position title, credentials &amp; brief biography will be placed here.]
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Verified Profile Slot</span>
        <span>KP, Pakistan</span>
      </div>
    </div>
  );
};
