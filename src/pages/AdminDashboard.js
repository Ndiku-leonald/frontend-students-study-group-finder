import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getUserDisplayName, getToken } from '../services/auth';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalSessions: 0,
    activeCourses: [],
  });
  const [users, setUsers] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userName = getUserDisplayName();
  const isAuthenticated = !!getToken();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [
          statsRes,
          usersRes,
          groupsRes,
          sessionsRes,
          recentRes,
          allGroupsRes
        ] = await Promise.allSettled([
          api.get('/admin/overview'),
          api.get('/auth/users'),
          api.get('/users/me/groups'),
          api.get('/users/me/sessions/upcoming'),
          api.get('/groups/recent'),
          api.get('/groups'),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats({
            totalUsers: statsRes.value.data.totalUsers || 0,
            totalGroups: statsRes.value.data.totalGroups || 0,
            totalSessions: statsRes.value.data.totalSessions || 0,
            activeCourses: statsRes.value.data.activeCourses || [],
          });
        }

        if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || []);
        if (groupsRes.status === 'fulfilled') setJoinedGroups(groupsRes.value.data || []);
        if (sessionsRes.status === 'fulfilled') setUpcomingSessions(sessionsRes.value.data || []);
        if (recentRes.status === 'fulfilled') setRecentGroups(recentRes.value.data || []);
        if (allGroupsRes.status === 'fulfilled') setAllGroups(allGroupsRes.value.data || []);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const joinGroup = async (groupId) => {
    try {
      await api.post(`/groups/join/${groupId}`);
      // Refresh joined groups
      const groupsRes = await api.get('/users/me/groups');
      setJoinedGroups(groupsRes.data || []);
    } catch (err) {
      setError('Failed to join group');
    }
  };

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
          <p>Administrator Dashboard - Monitor users, groups, and system activity.</p>
          <div className="hero-actions">
            <Link to="/groups/new" className="btn btn-primary">Create Group</Link>
            <Link to="/groups" className="btn btn-secondary">Browse Groups</Link>
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
            {users.slice(0, 10).map((user) => (
              <div key={user.id} className="user-item">
                <div>
                  <strong>{user.name}</strong>
                  <span className="user-email"> ({user.email})</span>
                </div>
                <span className="user-role">{user.role || 'student'}</span>
              </div>
            ))}
            {users.length > 10 && <p>... and {users.length - 10} more users</p>}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </section>

      {/* Student Dashboard Features */}
      <section className="card page-card detail-grid">
        <article className="detail-panel">
          <h3>My Groups</h3>
          {loading ? (
            <p>Loading...</p>
          ) : joinedGroups.length ? (
            joinedGroups.map((group) => (
              <div key={group.id} className="group-item">
                <p>{group.name}</p>
                <Link className="btn btn-small" to={`/groups/${group.id}`}>View</Link>
              </div>
            ))
          ) : (
            <p>No joined groups yet.</p>
          )}
          <Link className="btn btn-secondary btn-small" to="/groups">Browse All Groups</Link>
        </article>

        <article className="detail-panel">
          <h3>Upcoming Sessions</h3>
          {loading ? (
            <p>Loading...</p>
          ) : upcomingSessions.length ? (
            upcomingSessions.map((session) => (
              <p key={session.id}>{session.date} {session.time}</p>
            ))
          ) : (
            <p>No upcoming sessions.</p>
          )}
        </article>

        <article className="detail-panel">
          <h3>Recent Activity</h3>
          {loading ? (
            <p>Loading...</p>
          ) : recentGroups.length ? (
            recentGroups.map((group) => (
              <div key={group.id} className="group-item">
                <p>{group.name}</p>
                <button
                  className="btn btn-small"
                  onClick={() => joinGroup(group.id)}
                >
                  Join
                </button>
              </div>
            ))
          ) : (
            <p>No recent groups.</p>
          )}
        </article>
      </section>

      {/* Active Courses */}
      <section className="card page-card">
        <h3 className="section-title">Most Active Courses</h3>
        {(stats.activeCourses || []).length ? (
          (stats.activeCourses || []).map((course, index) => (
            <p key={`${course.name}-${index}`}>{course.name}: {course.activityCount || 0} activities</p>
          ))
        ) : (
          <p>No activity data available.</p>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
