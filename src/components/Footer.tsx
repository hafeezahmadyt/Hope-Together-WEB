import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { initialMockSettings } from '../data/mock/mockSettings';
import { AdminSiteSettings } from '../types/admin';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<AdminSiteSettings>(initialMockSettings);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        if (isMounted) setSettings(data);
      } catch {
        // Fallback
      }
    };

    loadSettings();

    const handleUpdate = () => {
      loadSettings();
    };

    window.addEventListener('hope_together_settings_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('hope_together_settings_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const socialItems = [
    settings.facebookUrl && {
      name: 'Facebook',
      url: settings.facebookUrl,
      icon: Facebook,
      ariaLabel: 'Hope Together Organization on Facebook',
      hoverClass: 'hover:text-[#1877F2] hover:bg-blue-50 hover:border-blue-200',
    },
    settings.instagramUrl && {
      name: 'Instagram',
      url: settings.instagramUrl,
      icon: Instagram,
      ariaLabel: 'Hope Together Organization on Instagram',
      hoverClass: 'hover:text-[#E4405F] hover:bg-rose-50 hover:border-rose-200',
    },
    settings.linkedinUrl && {
      name: 'LinkedIn',
      url: settings.linkedinUrl,
      icon: Linkedin,
      ariaLabel: 'Hope Together Organization on LinkedIn',
      hoverClass: 'hover:text-[#0A66C2] hover:bg-sky-50 hover:border-sky-200',
    },
    settings.youtubeUrl && {
      name: 'YouTube',
      url: settings.youtubeUrl,
      icon: Youtube,
      ariaLabel: 'Hope Together Organization on YouTube',
      hoverClass: 'hover:text-[#FF0000] hover:bg-red-50 hover:border-red-200',
    },
  ].filter(Boolean) as {
    name: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    ariaLabel: string;
    hoverClass: string;
  }[];

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-700 py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          {/* Brand & Organization Identity */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <img
                src={logoImg}
                alt="Hope Together Organization"
                className="h-10 w-auto object-contain"
                width="40"
                height="40"
              />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                  Hope Together
                </span>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-slate-400 uppercase -mt-0.5">
                  Organization
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 font-light leading-relaxed max-w-sm">
              {settings.shortDescription}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-light mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{settings.address}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-widest text-slate-900 font-semibold mb-1">
              Navigation
            </span>
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link to="/our-work" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Our Work
            </Link>
            <Link to="/partners" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Partners
            </Link>
            <Link to="/team" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Team
            </Link>
            <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </div>

          {/* Connect & Inquiries */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-slate-900 font-semibold mb-1">
              Stay Connected
            </span>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              For official inquiries, community coordination, or institutional correspondence:
            </p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#1D70B8]" />
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-sm font-medium text-[#1D70B8] hover:underline"
              >
                {settings.contactEmail}
              </a>
            </div>

            {/* Social media channels */}
            {socialItems.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block mb-2.5">
                  Social Media Channels
                </span>
                <div className="flex items-center gap-2">
                  {socialItems.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200/80 bg-slate-50 text-slate-600 transition-all duration-200 hover:shadow-xs active:scale-95 ${social.hoverClass}`}
                        aria-label={social.ariaLabel}
                        title={social.name}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legal & Transparency Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light">
          <p>© {currentYear} {settings.organizationName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Registered NGO in Khyber Pakhtunkhwa, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
