import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getUserDisplayName, getToken } from '../services/auth';

function StudentDashboard() {
  // Student dashboard combines the user's groups, upcoming sessions, and recent activity.
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
        // Fetch every dashboard panel in parallel so the page loads faster.
        const [groupsRes, sessionsRes, recentRes, allGroupsRes] = await Promise.allSettled([
          api.get('/users/me/groups'),
          api.get('/users/me/sessions/upcoming'),
          api.get('/groups/recent'),
          api.get('/groups'),
        ]);

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
      // Refresh the membership list so the UI reflects the new state immediately.
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
          <p>Manage your study groups, track sessions, and discover new learning opportunities.</p>
          <div className="hero-actions">
            <Link to="/groups/new" className="btn btn-primary">Create Group</Link>
            <Link to="/groups" className="btn btn-secondary">Browse Groups</Link>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-value">{joinedGroups.length}</span>
            <span className="metric-label">Joined Groups</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{allGroups.length}</span>
            <span className="metric-label">Available Groups</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{upcomingSessions.length}</span>
            <span className="metric-label">Upcoming Sessions</span>
          </div>
        </div>
      </header>

      {error && <p className="form-error">{error}</p>}

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
    </main>
  );
}

export default StudentDashboard;
