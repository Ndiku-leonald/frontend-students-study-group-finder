import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getUserDisplayName, getToken } from '../services/auth';

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Explore the active study spaces on campus.');
  const [error, setError] = useState('');

  const userName = getUserDisplayName();
  const isAuthenticated = !!getToken();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await api.get('/groups');
        setGroups(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        setGroups([]);
        setError('Unable to load groups. Please try again later.');
        setStatusMessage('The group feed is unavailable right now.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadGroups();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleSearch = async (value) => {
    if (!isAuthenticated) return;

    setSearch(value);
    setError('');

    try {
      if (!value.trim()) {
        const res = await api.get('/groups');
        setGroups(Array.isArray(res.data) ? res.data : []);
        setStatusMessage('Explore the active study spaces on campus.');
        return;
      }

      const res = await api.get(`/groups/search?query=${encodeURIComponent(value)}`);
      setGroups(Array.isArray(res.data) ? res.data : []);
      setStatusMessage(`Showing results for "${value}".`);
    } catch (err) {
      setGroups([]);
      setError('Search failed. Please try again.');
      setStatusMessage('No study groups matched your search.');
    }
  };

  const totalMembers = groups.reduce((count, group) => count + (Number(group.members) || 0), 0);

  return (
    <main className="page-content">
      <header className="page-hero card">
        <div className="page-hero-copy">
          <p className="eyebrow">UCU Study Group Finder</p>
          <h2>find your droup learn with ease</h2>
          {isAuthenticated && (
            <p className="welcome-message">Welcome, {userName}!</p>
          )}
          <p className="hero-text">
            Discover study groups, create sessions, and keep your academic network organized in one place.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/groups/new" className="btn btn-primary">Create Group</Link>
                <Link to="/leaders/sessions/new" className="btn btn-secondary">Plan Session</Link>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Sign In to Get Started</Link>
            )}
          </div>
        </div>

        {isAuthenticated && (
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
        )}
      </header>

      {isAuthenticated ? (
        <section className="card page-card">
          <div className="section-header">
            <div>
              <p className="eyebrow eyebrow-muted">Directory</p>
              <h3 className="section-title">Study groups</h3>
            </div>
            <p className="section-note">{statusMessage}</p>
          </div>

          {error && <p className="form-error">{error}</p>}

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
                <article className="group-card" key={group.id || group._id || group.name}>
                  <div className="group-card-top">
                    <div>
                      <div className="group-course">{group.course || 'Study Group'}</div>
                      <h3 className="group-title">{group.name}</h3>
                    </div>
                    <div className="group-badge">{group.members ?? 0} members</div>
                  </div>
                  <p className="group-description">{group.description || 'No description provided yet.'}</p>
                  <div className="card-actions">
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => window.location.href = `/groups/${group.id}`}
                    >
                      View Details
                    </button>
                  </div>
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
      ) : (
        <section className="card page-card">
          <div className="state-card state-card-empty">
            <h3>Please sign in to view study groups</h3>
            <p>You need to be logged in to browse and join study groups.</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Dashboard;