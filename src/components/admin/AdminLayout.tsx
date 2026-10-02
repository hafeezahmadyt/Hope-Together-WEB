import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { authService } from '../../services/authService';
import { messageService } from '../../services/messageService';

export const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Close mobile menu on path changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      messageService.getMessages().then((msgs) => {
        const count = msgs.filter((m) => m.status === 'Unread').length;
        setUnreadCount(count);
      });
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Derive current section name for breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSection = pathParts[1]
    ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
    : 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans antialiased">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 fixed inset-y-0 left-0 z-40">
        <AdminSidebar unreadCount={unreadCount} />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <AdminSidebar
              unreadCount={unreadCount}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </div>
          <div
            className="flex-1"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminNavbar
          title={currentSection}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
