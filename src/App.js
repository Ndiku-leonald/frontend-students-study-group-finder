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
import { getToken, getUserRole } from './services/auth';

function AppShell() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const token = getToken();
  const role = getUserRole();

  if (!token && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  if (token && isAuthRoute) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = role === 'admin' ? '/dashboard/admin' : '/dashboard/student';
    return <Navigate to={dashboardPath} replace />;
  }

  if (token && location.pathname === '/dashboard/admin' && role !== 'admin') {
    return <Navigate to="/dashboard/student" replace />;
  }

  if (token && location.pathname === '/dashboard/student' && role !== 'student') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return (
    <div className={isAuthRoute ? 'app-shell app-shell-auth' : 'app-shell'}>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={role === 'admin' ? '/dashboard/admin' : '/dashboard/student'} replace />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/groups/new" element={<GroupForm />} />
        <Route path="/groups/:groupId/edit" element={<GroupForm />} />
        <Route path="/leaders/sessions/new" element={<SessionScheduler />} />
        <Route path="/dashboard/student" element={role === 'student' ? <StudentDashboard /> : <Navigate to="/dashboard/admin" replace />} />
        <Route path="/dashboard/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard/student" replace />} />
        <Route path="/invites" element={<InvitesPage />} />
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
      <AppShell />
    </BrowserRouter>
  );
}

export default App;