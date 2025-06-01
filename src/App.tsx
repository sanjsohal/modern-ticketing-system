import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { TicketList } from './components/ticket/TicketList';
import { TicketDetail } from './components/ticket/TicketDetail';
import { NewTicket } from './components/ticket/NewTicket';
import { KnowledgeBase } from './components/knowledge/KnowledgeBase';
import { ArticleDetail } from './components/knowledge/ArticleDetail';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App wrapper
const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TicketList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TicketDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NewTicket />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/knowledge"
        element={
          <ProtectedRoute>
            <MainLayout>
              <KnowledgeBase />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/knowledge/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ArticleDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Redirect root to dashboard or login based on auth status */}
      <Route
        path="*"
        element={<Navigate to="/dashboard\" replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </TicketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;