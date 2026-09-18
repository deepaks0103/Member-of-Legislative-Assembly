import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import RegisterComplaint from './pages/RegisterComplaint';
import TrackComplaint from './pages/TrackComplaint';
import ContactOffice from './pages/ContactOffice';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterComplaint />} />
              <Route path="/register-complaint" element={<RegisterComplaint />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="/track-complaint" element={<TrackComplaint />} />
              <Route path="/contact" element={<ContactOffice />} />
              <Route path="/contact-office" element={<ContactOffice />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/help" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Staff Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/blog/:slug" element={<EventDetail type="blog" />} />
              <Route path="/events/:slug" element={<EventDetail type="events" />} />
              {/* Catch-all fallback so undefined routes never render a blank page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BackToTop />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
