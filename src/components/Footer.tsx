import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
              Empowering communities, creating opportunities, and safeguarding dignity across
              Khyber Pakhtunkhwa, Pakistan.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-light mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Regional Focus: Khyber Pakhtunkhwa, Pakistan</span>
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
                href="mailto:info@hopetogether.org.pk"
                className="text-sm font-medium text-[#1D70B8] hover:underline"
              >
                info@hopetogether.org.pk
              </a>
            </div>

            {/* Social media placeholder container */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-medium text-slate-400 block mb-2">
                Social Media Channels
              </span>
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-500 text-[11px] font-mono">
                  [Social Links to be connected]
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Transparency Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light">
          <p>© {currentYear} Hope Together Organization. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Registered NGO in Khyber Pakhtunkhwa, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
