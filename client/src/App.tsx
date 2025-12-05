import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ScoringProvider } from './contexts/ScoringContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { PortalSelectionPage } from './pages/PortalSelectionPage';
import { RoleAuthPage } from './pages/RoleAuthPage';
import { ParticipantDashboard } from './pages/ParticipantDashboard';
import { SubmitProjectPage } from './pages/SubmitProjectPage';
import { JudgeDashboard } from './pages/JudgeDashboard';
import { JudgeScorePage } from './pages/JudgeScorePage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <ScoringProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/portals" element={<PortalSelectionPage />} />
            <Route path="/auth/:role" element={<RoleAuthPage />} />

            {/* Participant routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['participant']}>
                  <ParticipantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit"
              element={
                <ProtectedRoute allowedRoles={['participant']}>
                  <SubmitProjectPage />
                </ProtectedRoute>
              }
            />

            {/* Judge routes */}
            <Route
              path="/judge"
              element={
                <ProtectedRoute allowedRoles={['judge']}>
                  <JudgeDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/judge/score"
              element={
                <ProtectedRoute allowedRoles={['judge']}>
                  <JudgeScorePage />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ScoringProvider>
    </AuthProvider>
  );
}
