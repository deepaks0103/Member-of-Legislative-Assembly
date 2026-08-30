import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import RegisterComplaint from './pages/RegisterComplaint';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterComplaint />} />
            <Route path="/register-complaint" element={<RegisterComplaint />} />
            <Route path="/blog/:slug" element={<EventDetail type="blog" />} />
            <Route path="/events/:slug" element={<EventDetail type="events" />} />
            {/* Catch-all fallback so undefined routes never render a blank page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BackToTop />
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
