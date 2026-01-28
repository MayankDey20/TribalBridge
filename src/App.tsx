import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './frontend/layout/Header';
import { Footer } from './frontend/layout/Footer';
import { HomePage } from './frontend/features/pages/HomePage';
import { TranslatePage } from './frontend/features/translation/TranslatePage';
import { AuthPage } from './frontend/features/pages/AuthPage';
import { AuthCallbackPage } from './frontend/features/pages/AuthCallbackPage';
import { DashboardPage } from './frontend/features/pages/DashboardPage';
import { AboutPage } from './frontend/features/pages/AboutPage';
import { LanguagesPage } from './frontend/features/pages/LanguagesPage';
import { ProfilePage } from './frontend/features/pages/ProfilePage';
import { HistoryPage } from './frontend/features/pages/HistoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/translate" element={<TranslatePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/languages" element={<LanguagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;