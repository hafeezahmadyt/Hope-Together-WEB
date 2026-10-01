import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { OurWorkPage } from './pages/OurWorkPage';
import { PartnersPage } from './pages/PartnersPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="our-work" element={<OurWorkPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
