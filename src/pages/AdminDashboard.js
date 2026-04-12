import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getUserAdminCode, getUserDisplayName, getToken } from '../services/auth';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalSessions: 0,
    activeCourses: [],
  });
  const [users, setUsers] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userName = getUserDisplayName();
  const adminCode = getUserAdminCode();
  const isAuthenticated = !!getToken();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [statsRes, usersRes, recentRes] = await Promise.allSettled([
          api.get('/dashboard/admin'),
          api.get('/auth/users'),
          api.get('/groups/recent'),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats({
            totalUsers: statsRes.value.data.totalUsers || 0,
            totalGroups: statsRes.value.data.totalGroups || 0,
            totalSessions: statsRes.value.data.totalSessions || 0,
            activeCourses: statsRes.value.data.mostActiveCourses || [],
          });
        }

        if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || []);
        if (recentRes.status === 'fulfilled') setRecentGroups(recentRes.value.data || []);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="page-content">
        <div className="state-card state-card-empty">
          <h3>Please sign in to access your dashboard</h3>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-content">
      <header className="page-hero card">
        <div className="page-hero-copy">
          <h2>Welcome, {userName}!</h2>
          <p>Administrator Control Panel - monitor platform activity and user roles.</p>
          {adminCode ? <p className="admin-code-chip">Admin Code: {adminCode}</p> : null}
          <div className="hero-actions">
            <Link to="/groups" className="btn btn-primary">Manage Groups</Link>
            <Link to="/invites" className="btn btn-secondary">Review Invites</Link>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-value">{stats.totalUsers}</span>
            <span className="metric-label">Total Users</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{stats.totalGroups}</span>
            <span className="metric-label">Total Groups</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{stats.totalSessions}</span>
            <span className="metric-label">Total Sessions</span>
          </div>
        </div>
      </header>

      {error && <p className="form-error">{error}</p>}

      {/* Admin Statistics */}
      <section className="card page-card metrics-grid">
        <article className="mini-metric">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </article>
        <article className="mini-metric">
          <h3>{stats.totalGroups}</h3>
          <p>Total Groups</p>
        </article>
        <article className="mini-metric">
          <h3>{stats.totalSessions}</h3>
          <p>Total Sessions</p>
        </article>
      </section>

      {/* User Management */}
      <section className="card page-card">
        <h3 className="section-title">User Management</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length ? (
          <div className="user-list">
            {users.slice(0, 15).map((user) => (
              <div key={user.id} className="user-item">
                <div>
                  <strong>{user.name}</strong>
                  <span className="user-email"> ({user.email})</span>
                </div>
                <span className="user-role">{user.role === 'admin' ? 'admin' : 'student'}</span>
              </div>
            ))}
            {users.length > 15 && <p>... and {users.length - 15} more users</p>}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </section>

      {/* Admin Activity */}
      <section className="card page-card detail-grid">
        <article className="detail-panel">
          <h3>Recently Created Groups</h3>
          {loading ? (
            <p>Loading...</p>
          ) : recentGroups.length ? (
            recentGroups.map((group) => (
              <div key={group.id} className="group-item">
                <p>{group.name}</p>
                <Link className="btn btn-small" to={`/groups/${group.id}`}>View</Link>
              </div>
            ))
          ) : (
            <p>No recent groups.</p>
          )}
          <Link className="btn btn-secondary btn-small" to="/groups">Open Group Directory</Link>
        </article>

        <article className="detail-panel">
          <h3>Admin Shortcuts</h3>
          <p>Use these actions to manage platform activity quickly.</p>
          <div className="card-actions">
            <Link className="btn btn-small" to="/groups/new">Create New Group</Link>
            <Link className="btn btn-small btn-secondary" to="/leaders/sessions/new">Schedule Session</Link>
          </div>
        </article>

        <article className="detail-panel">
          <h3>Role Distribution</h3>
          <p>Total admins: {users.filter((user) => user.role === 'admin').length}</p>
          <p>Total students: {users.filter((user) => user.role !== 'admin').length}</p>
        </article>
      </section>

      {/* Active Courses */}
      <section className="card page-card">
        <h3 className="section-title">Most Active Courses</h3>
        {(stats.activeCourses || []).length ? (
          (stats.activeCourses || []).map((course, index) => (
            <p key={`${course.course || 'course'}-${index}`}>{course.course || 'Unspecified'}: {course.groupCount || 0} groups</p>
          ))
        ) : (
          <p>No activity data available.</p>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
