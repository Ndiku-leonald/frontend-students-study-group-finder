import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GroupChat from './pages/GroupChat';
import CreateSession from './pages/CreateSession';
import GroupList from './pages/GroupList';
import GroupDetail from './pages/GroupDetail';
import GroupForm from './pages/GroupForm';
import SessionScheduler from './pages/SessionScheduler';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InvitesPage from './pages/InvitesPage';
import Profile from './pages/Profile';
import { getToken, getUserRole } from './services/auth';

// Use the signed-in role to route the user to the correct dashboard.
// The app does not rely on a separate auth store; it reads the stored session data.
const getDashboardPath = (role) => (role === 'admin' ? '/dashboard/admin' : '/dashboard/student');

function AppShell() {
  // The shell handles auth gating before the route tree renders.
  // This keeps route-level redirects consistent across the whole app.
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const token = getToken();
  const role = getUserRole();
  const dashboardPath = getDashboardPath(role);
  const isDashboardRoute = location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/');

  if (!token && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  if (token && isAuthRoute) {
    return <Navigate to={dashboardPath} replace />;
  }

  if (token && isDashboardRoute && location.pathname !== dashboardPath) {
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className={isAuthRoute ? 'app-shell app-shell-auth' : 'app-shell'}>
      {/* Hide the sidebar on auth pages so the login flow stays focused. */}
      {/* The navbar only appears after authentication succeeds. */}
      {!isAuthRoute && <Navbar />}
      <Routes>
        {/* Redirect the home route to the appropriate dashboard for the current role. */}
        {/* This makes the root URL behave like a smart landing page. */}
        <Route path="/" element={<Navigate to={dashboardPath} replace />} />
        <Route path="/dashboard" element={<Navigate to={dashboardPath} replace />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/groups/new" element={<GroupForm />} />
        <Route path="/groups/:groupId/edit" element={<GroupForm />} />
        <Route path="/leaders/sessions/new" element={<SessionScheduler />} />
        <Route path="/dashboard/student" element={role === 'student' ? <StudentDashboard /> : <Navigate to={dashboardPath} replace />} />
        <Route path="/dashboard/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to={dashboardPath} replace />} />
        <Route path="/invites" element={<InvitesPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/chat" element={<GroupChat />} />
        <Route path="/session" element={<CreateSession />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* BrowserRouter enables client-side navigation without page reloads. */}
      <AppShell />
    </BrowserRouter>
  );
}

export default App;