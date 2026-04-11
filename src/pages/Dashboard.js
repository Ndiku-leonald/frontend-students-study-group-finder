import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getUserDisplayName, getUserRole } from '../services/auth';

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Explore the active study spaces on campus.');
  const [joiningGroupId, setJoiningGroupId] = useState(null);
  const displayName = getUserDisplayName();
  const role = getUserRole();
  const roleLabel = role === 'admin' ? 'Administrator' : 'Student';

  const joinGroup = async (groupId) => {
    setJoiningGroupId(groupId);

    try {
      await api.post(`/groups/${groupId}/join`);
      setStatusMessage('You joined the group successfully.');
    } catch {
      try {
        await api.post('/groups/join', { groupId });
        setStatusMessage('You joined the group successfully.');
      } catch {
        setStatusMessage('Unable to join this group right now.');
      }
    } finally {
      setJoiningGroupId(null);
    }
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await api.get('/groups');
        setGroups(res.data);
        setStatusMessage('Explore the active study spaces on campus.');
      } catch {
        setGroups([]);
        setStatusMessage('The group feed is unavailable right now.');
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  const handleSearch = async (value) => {
    setSearch(value);

    try {
      if (!value.trim()) {
        const res = await api.get('/groups');
        setGroups(res.data);
        setStatusMessage('Explore the active study spaces on campus.');
        return;
      }

      const res = await api.get(`/groups/search?query=${encodeURIComponent(value)}`);
      setGroups(res.data);
      setStatusMessage(`Showing results for "${value}".`);
    } catch {
      setGroups([]);
      setStatusMessage('No study groups matched your search.');
    }
  };

  const totalMembers = groups.reduce((count, group) => count + (Number(group.members) || 0), 0);

  return (
    <main className="page-content home-page">
      <header className="page-hero card">
        <div className="page-hero-copy">
          <p className="eyebrow">UCU Study Group Finder</p>
          <div className="welcome-panel">
            <p className="welcome-kicker">Welcome back</p>
            <h2>{displayName}</h2>
            <div className="welcome-role">{roleLabel}</div>
            <p className="hero-text hero-text-compact">
              Start from here, create a group, or plan your next session in a few seconds.
            </p>
          </div>
          <div className="hero-actions">
            <Link to="/create-group" className="btn btn-primary">Create Group</Link>
            <Link to="/session" className="btn btn-secondary">Plan Session</Link>
          </div>
        </div>

        <div className="hero-metrics" aria-label="Study group summary">
          <div className="metric-card">
            <span className="metric-value">{groups.length}</span>
            <span className="metric-label">Groups</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{totalMembers}</span>
            <span className="metric-label">Members</span>
          </div>
          <div className="metric-card metric-card-accent">
            <span className="metric-value">Live</span>
            <span className="metric-label">Search ready</span>
          </div>
        </div>
      </header>

      <section className="card page-card">
        <div className="section-header">
          <div>
            <p className="eyebrow eyebrow-muted">Directory</p>
            <h3 className="section-title">Study groups</h3>
          </div>
          <p className="section-note">{statusMessage}</p>
        </div>

        <div className="search-row">
          <input
            className="search-input"
            placeholder="Search by course, topic, or group name"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="state-card">Loading groups...</div>
        ) : groups.length ? (
          <div className="group-grid">
            {groups.map((group) => (
              <article className="group-card" key={group.id}>
                <div className="group-card-top">
                  <div>
                    <div className="group-course">{group.course || 'Study Group'}</div>
                    <h3 className="group-title">{group.name}</h3>
                  </div>
                  <div className="group-badge">{group.members ?? 0} members</div>
                </div>
                <p className="group-description">{group.description || 'No description provided yet.'}</p>
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => joinGroup(group.id)}
                  disabled={joiningGroupId === group.id}
                >
                  {joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="state-card state-card-empty">
            <h3>No groups found</h3>
            <p>Try a different search or create the first group for your course.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;