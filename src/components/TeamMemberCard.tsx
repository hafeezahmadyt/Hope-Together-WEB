import React, { useState } from 'react';
import { User, Linkedin, Twitter, Mail, Instagram, Facebook, Info } from 'lucide-react';
import { TeamMember } from '../types';
import { AdminTeamMember } from '../types/admin';

interface TeamMemberCardProps {
  member?: TeamMember | AdminTeamMember;
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
  const [isTouchActive, setIsTouchActive] = useState(false);

  if (member) {
    const adminMember = member as AdminTeamMember;
    const photo = adminMember.photoUrl || (member as TeamMember).image;

    // Build social links array
    const socialList = (member as TeamMember).socialLinks && (member as TeamMember).socialLinks!.length > 0
      ? (member as TeamMember).socialLinks!
      : [
          adminMember.linkedinUrl ? { platform: 'linkedin', url: adminMember.linkedinUrl } : null,
          adminMember.instagramUrl ? { platform: 'instagram', url: adminMember.instagramUrl } : null,
          adminMember.facebookUrl ? { platform: 'facebook', url: adminMember.facebookUrl } : null,
          adminMember.email ? { platform: 'mail', url: `mailto:${adminMember.email}` } : null,
        ].filter(Boolean) as { platform: string; url: string }[];

    const hasAbout = Boolean(member.bio && member.bio.trim().length > 0);

    return (
      <div
        onClick={() => setIsTouchActive((prev) => !prev)}
        className="p-6 rounded-3xl bg-white/80 border border-slate-200/70 hover:border-slate-300 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-full group cursor-pointer relative"
      >
        <div>
          {/* Photograph Container with Animated Hover Overlay */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-5 relative flex items-center justify-center">
            {photo ? (
              <img
                src={photo}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <User className="w-10 h-10 mb-1" />
                <span className="text-[11px] font-mono">[Official Photo]</span>
              </div>
            )}

            {/* Decent Animation: Hover / Touch Overlay for "About" */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/90 to-slate-900/75 backdrop-blur-[3px] p-5 flex flex-col justify-between transition-all duration-300 ease-out z-10 ${
                isTouchActive
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-sky-300 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-xs">
                    <Info className="w-3 h-3 text-sky-400" />
                    About
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                    {member.position}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[135px] pr-1 text-left">
                  <p className="text-slate-200 text-xs sm:text-sm font-light leading-relaxed">
                    {hasAbout
                      ? member.bio
                      : `Official profile of ${member.name}, serving as ${member.position} at Hope Together Organization.`}
                  </p>
                </div>
              </div>

              {socialList.length > 0 && (
                <div className="pt-3 border-t border-white/10 flex items-center gap-2.5 text-slate-300">
                  {socialList.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                      aria-label={`${member.name} on ${link.platform}`}
                    >
                      {link.platform.toLowerCase() === 'linkedin' ? (
                        <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                      ) : link.platform.toLowerCase() === 'instagram' ? (
                        <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                      ) : link.platform.toLowerCase() === 'facebook' ? (
                        <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                      ) : link.platform.toLowerCase() === 'twitter' ? (
                        <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-[#1D70B8]" />
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Statically shows ONLY the designation and name */}
          <span className="text-[11px] font-semibold text-[#1D70B8] uppercase tracking-wider block mb-1 transition-colors group-hover:text-[#155A96]">
            {member.position}
          </span>
          <h3 className="text-xl font-medium text-slate-900 tracking-tight group-hover:text-slate-950 transition-colors">
            {member.name}
          </h3>
        </div>
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

        <h3 className="text-lg font-medium text-slate-800 tracking-tight">
          [Official Member Name]
        </h3>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Verified Profile Slot</span>
        <span>KP, Pakistan</span>
      </div>
    </div>
  );
};
