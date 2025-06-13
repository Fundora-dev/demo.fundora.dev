
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { InvestorDashboardPage } from './pages/InvestorDashboardPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectEditPage } from './pages/ProjectEditPage'; // Import ProjectEditPage
import { NotFoundPage } from './pages/NotFoundPage';
import { UserProvider, useUser } from './contexts/UserContext';
import { UserRole } from './types';
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: UserRole; // Make allowedRole optional for general auth check
  checkOwnerId?: string; // Optional: for checking specific project ownership
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole, checkOwnerId }) => {
  const { currentUser } = useUser();
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  // Further check for specific project ownership could be added here if project data is available
  // For now, role-based protection is sufficient for this structure.
  // if (checkOwnerId && currentUser.id !== checkOwnerId) {
  // return <Navigate to="/" replace />;
  // }
  return children;
};


const AppContent: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop /> {/* Add ScrollToTop here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route 
          path="/dashboard/owner" 
          element={
            <ProtectedRoute allowedRole={UserRole.OWNER}>
              <OwnerDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/investor" 
          element={
            <ProtectedRoute allowedRole={UserRole.INVESTOR}>
              <InvestorDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-project" 
          element={
            <ProtectedRoute allowedRole={UserRole.OWNER}>
              <CreateProjectPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects/:projectId/edit"
          element={
            <ProtectedRoute allowedRole={UserRole.OWNER}>
              <ProjectEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </HashRouter>
  );
};

export default App;