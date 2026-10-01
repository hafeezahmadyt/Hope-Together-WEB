import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Our Work', path: '/our-work' },
  { label: 'Partners', path: '/partners' },
  { label: 'Team', path: '/team' },
  { label: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <header
        className={`pointer-events-auto max-w-5xl mx-auto mt-4 sm:mt-6 bg-white/80 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'shadow-[0_12px_36px_rgba(0,0,0,0.08)] bg-white/90' : ''
        }`}
      >
        {/* Brand Identity / Official Emblem */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded-lg"
          aria-label="Hope Together Organization Home"
        >
          <img
            src={logoImg}
            alt="Hope Together Organization Official Emblem"
            className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            width="40"
            height="40"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase leading-tight">
              Hope Together
            </span>
            <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.25em] text-slate-400 uppercase -mt-0.5">
              Organization
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative py-1 transition-colors duration-200 hover:text-slate-950 ${
                  isActive
                    ? 'text-slate-950 font-semibold'
                    : 'text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1D70B8] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/contact#get-involved"
            className="hidden sm:inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
          >
            Get Involved
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Collapsible Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          className="pointer-events-auto md:hidden max-w-md mx-auto mt-3 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-3xl p-6 transition-all animate-in fade-in slide-in-from-top-4 duration-200"
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-50/80 text-[#1D70B8] font-semibold'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <Link
                to="/contact#get-involved"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-5 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
              >
                Get Involved
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
