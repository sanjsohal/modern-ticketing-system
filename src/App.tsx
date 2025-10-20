import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { TicketList } from './components/ticket/TicketList';
import { TicketDetail } from './components/ticket/TicketDetail';
import { NewTicket } from './components/ticket/NewTicket';
import { KnowledgeBase } from './components/knowledge/KnowledgeBase';
import { ArticleDetail } from './components/knowledge/ArticleDetail';
import { useIdleTimeout } from './hooks/useIdleTimeout';
import { IdleWarningModal } from './components/ui/IdleWarningModal';
import { ENV } from './config/env';

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

// Main App wrapper with idle timeout detection
const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  // Handle idle timeout - log user out
  const handleIdle = async () => {
    if (isAuthenticated) {
      await logout();
      navigate('/login', { 
        replace: true, 
        state: { message: 'You have been logged out due to inactivity.' } 
      });
    }
  };

  // Handle warning - show modal before auto-logout
  const handleWarning = () => {
    if (isAuthenticated) {
      setShowWarning(true);
    }
  };

  // User wants to stay logged in
  const handleContinue = () => {
    setShowWarning(false);
    resetTimer(); // Reset the idle timer
  };

  // User wants to logout now
  const handleLogoutNow = async () => {
    setShowWarning(false);
    await logout();
    navigate('/login', { replace: true });
  };

  // Setup idle timeout detection
  const { resetTimer } = useIdleTimeout({
    onIdle: handleIdle,
    onWarning: handleWarning,
    idleTime: ENV.IDLE_TIMEOUT,
    warningTime: ENV.IDLE_WARNING_TIME,
    enabled: isAuthenticated, // Only track when user is logged in
  });

  return (
    <>
      <IdleWarningModal
        isOpen={showWarning}
        onContinue={handleContinue}
        onLogout={handleLogoutNow}
        countdown={Math.floor(ENV.IDLE_WARNING_TIME / 1000)}
      />
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
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
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </>
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