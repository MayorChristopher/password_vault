import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import VaultPage from '@/pages/VaultPage';
import PasswordGeneratorPage from '@/pages/PasswordGeneratorPage';
import SecuritySettingsPage from '@/pages/SecuritySettingsPage';
import ActivityLogsPage from '@/pages/ActivityLogsPage';
import Layout from '@/components/Layout';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <>
      <Helmet>
        <title>SecureVault - Professional Password Management</title>
        <meta name="description" content="Professional password vault management system with end-to-end encryption, secure credential storage, and advanced security features for tech professionals." />
      </Helmet>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="vault" element={<VaultPage />} />
                <Route path="generator" element={<PasswordGeneratorPage />} />
                <Route path="security" element={<SecuritySettingsPage />} />
                <Route path="activity" element={<ActivityLogsPage />} />
              </Route>
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;