import React from 'react';
import { Menu, User, Shield } from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminNavbarProps {
  onOpenMobileMenu: () => void;
  title?: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onOpenMobileMenu, title }) => {
  const currentUser = authService.getCurrentUser();

  return (
    <header className="h-16 px-4 sm:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
            <span className="hidden sm:inline">Hope Together CMS</span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{title}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Mock Data Environment Indicator */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Local Mock Mode
        </span>

        {/* User Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200/70">
          <div className="w-8 h-8 rounded-full bg-[#1D70B8]/10 text-[#1D70B8] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono leading-tight flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-[#16A34A]" />
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
