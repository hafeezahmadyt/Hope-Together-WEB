import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Handshake,
  Calendar,
  FolderKanban,
  Newspaper,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { authService } from '../../services/authService';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  unreadCount?: number;
}

const mainNavItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Team', path: '/admin/team', icon: Users },
  { label: 'Partners', path: '/admin/partners', icon: Handshake },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Stories', path: '/admin/stories', icon: Newspaper },
  { label: 'Messages', path: '/admin/messages', icon: MessageSquare, badge: true },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile, unreadCount = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded-lg"
          >
            <img
              src={logoImg}
              alt="Hope Together Organization"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold tracking-wider text-slate-900 uppercase leading-tight">
                Hope Together
              </span>
              <span className="text-[9px] font-semibold tracking-[0.2em] text-[#1D70B8] uppercase -mt-0.5">
                Admin CMS
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <span className="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase block mb-2">
              Management
            </span>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-[#1D70B8] font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1D70B8] text-white">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Settings Section */}
          <div className="pt-2 border-t border-slate-100">
            <span className="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase block mb-2">
              System
            </span>
            <nav className="space-y-1">
              <NavLink
                to="/admin/settings"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#1D70B8] font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`
                }
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span>Settings</span>
              </NavLink>

              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span>Public Website</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
