import { HashRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
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

const getDashboardPath = (role) => (role === 'admin' ? '/dashboard/admin' : '/dashboard/student');

function AppShell() {
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
      {!isAuthRoute && <Navbar />}
      <Routes>
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
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}

export default App;