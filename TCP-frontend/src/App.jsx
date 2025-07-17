import { ChakraProvider, ColorModeScript, Spinner, Flex, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import { PrivateNotesProvider } from './contexts/PrivateNotesContext';
import { ActivityTimelineProvider } from './contexts/ActivityTimelineContext';
import theme from "./utils/theme";
import Login from './components/auth/Login'
import Signup from './components/auth/Signup';
import {
  AdminDashboardNew as AdminDashboard,
  EmployeeDashboard,
  FileSharing,
  NewNavbar as Navbar,
  AttendanceTracker,
  LeaveRequest,
  AdminAttendance,
  AdminSettings,
  BroadcastMessage,
} from './components';
import AttendancePage from './pages/AttendancePage';
import { NotificationsPage } from './pages';
import ActivityPage from './pages/ActivityPage';
import Tutorial from './pages/Tutorial';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/layout/MainLayout';
import ChatWindow from './components/ChatWindow';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner while auth state is loading
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/employee'} replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <AuthProvider>
          <AttendanceProvider>
            <CalendarProvider>
              <NotificationProvider>
                <PrivateNotesProvider>
                  <ActivityTimelineProvider>
                    <Routes>
                      {/* Public Route */}
                      <Route path="/" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      {/* Protected Routes - Move notifications route inside admin/employee sections */}
                      <Route path="/admin/*" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="attendance" element={<AdminAttendance />} />
                            <Route path="broadcasts" element={<BroadcastMessage />} />
                            <Route path="notifications" element={<NotificationsPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                          </Routes>
                        </ProtectedRoute>
                      } />

                      <Route path="/employee/*" element={
                        <ProtectedRoute allowedRoles={['employee']}>
                          <Routes>
                            <Route path="/" element={<EmployeeDashboard />} />
                            <Route path="notifications" element={<NotificationsPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                          </Routes>
                        </ProtectedRoute>
                      } />

                      {/* Common Protected Routes */}
                      <Route path="/attendance" element={
                        <ProtectedRoute>
                          <AttendancePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/leave-request" element={
                        <ProtectedRoute>
                          <LeaveRequest />
                        </ProtectedRoute>
                      } />
                      <Route path="/files" element={
                        <ProtectedRoute>
                          <FileSharing />
                        </ProtectedRoute>
                      } />
                      <Route path="/activity" element={
                        <ProtectedRoute>
                          <ActivityPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/tutorial" element={
                        <ProtectedRoute>
                          <Tutorial />
                        </ProtectedRoute>
                      } />

                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ActivityTimelineProvider>
                </PrivateNotesProvider>
              </NotificationProvider>
            </CalendarProvider>
          </AttendanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App