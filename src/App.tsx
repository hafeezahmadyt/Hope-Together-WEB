import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { OurWorkPage } from './pages/OurWorkPage';
import { PartnersPage } from './pages/PartnersPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';

// Admin CMS Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminPartnersPage } from './pages/admin/AdminPartnersPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminStoriesPage } from './pages/admin/AdminStoriesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes (Kept completely intact) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="our-work" element={<OurWorkPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Authentication Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin CMS Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="partners" element={<AdminPartnersPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="stories" element={<AdminStoriesPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
