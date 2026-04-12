import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getToken, getUserFromToken } from '../services/auth';

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroupId, setJoiningGroupId] = useState(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    course: '',
    faculty: '',
  });

  const isAuthenticated = !!getToken();
  const currentUser = getUserFromToken();

  const joinGroup = async (groupId) => {
    if (!isAuthenticated) {
      setJoinMessage('Please sign in to join groups.');
      return;
    }

    setJoinMessage('');
    setError('');
    setJoiningGroupId(groupId);

    try {
      await api.post(`/groups/join/${groupId}`);
      setJoinMessage('You joined the group successfully!');
      // Refresh groups to update member counts
      await fetchGroups();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Unable to join this group right now.';
      setError(errorMsg);
    } finally {
      setJoiningGroupId(null);
    }
  };

  const fetchGroups = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.title.trim()) params.set('title', filters.title.trim());
      if (filters.course.trim()) params.set('course', filters.course.trim());
      if (filters.faculty.trim()) params.set('faculty', filters.faculty.trim());

      const query = params.toString();
      const endpoint = query ? `/groups/search?${query}` : '/groups';
      const res = await api.get(endpoint);
      setGroups(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setGroups([]);
      setError('Unable to load groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    } else {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  const summary = useMemo(() => {
    if (loading) return 'Loading groups...';
    return `${groups.length} group${groups.length === 1 ? '' : 's'} found`;
  }, [groups, loading]);

  const isGroupLeader = (group) => {
    return currentUser && (group.leaderId === currentUser.id || group.leader?.id === currentUser.id);
  };

  const isGroupMember = (group) => {
    return currentUser && group.members?.some(member => member.id === currentUser.id);
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Group Directory</h2>
        <p>Search by title, course, or faculty.</p>
      </header>

      {isAuthenticated ? (
        <section className="card page-card">
          <div className="filters-grid">
            <input
              className="form-input"
              placeholder="Search by title"
              value={filters.title}
              onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
            />
            <input
              className="form-input"
              placeholder="Filter by course"
              value={filters.course}
              onChange={(e) => setFilters((prev) => ({ ...prev, course: e.target.value }))}
            />
            <input
              className="form-input"
              placeholder="Filter by faculty"
              value={filters.faculty}
              onChange={(e) => setFilters((prev) => ({ ...prev, faculty: e.target.value }))}
            />
          </div>

          <p className="section-note">{summary}</p>
          {joinMessage && <p className="form-success">{joinMessage}</p>}
          {error && <p className="form-error">{error}</p>}

          {loading ? (
            <div className="state-card">Loading directory...</div>
          ) : (
            <div className="group-grid">
              {groups.map((group) => (
                <article className={`group-card ${isGroupLeader(group) ? 'group-card-leader' : ''}`} key={group.id}>
                  <div className="group-card-top">
                    <div>
                      <div className="group-course">{group.course || 'Study Group'}</div>
                      <h3 className="group-title">
                        {group.name || group.title}
                        {isGroupLeader(group) && <span className="leader-badge"> (Leader)</span>}
                      </h3>
                      {group.leader && (
                        <div className="group-leader">Led by {group.leader.name || group.leader.fullName}</div>
                      )}
                    </div>
                    <div className="group-badge">{group.members ?? 0} members</div>
                  </div>
                  <p className="group-description">{group.description || 'No description available.'}</p>
                  {group.location && (
                    <div className="group-location">📍 {group.location}</div>
                  )}
                  <div className="card-actions">
                    {!isGroupMember(group) && !isGroupLeader(group) && (
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => joinGroup(group.id)}
                        disabled={joiningGroupId === group.id}
                      >
                        {joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                      </button>
                    )}
                    {isGroupMember(group) && !isGroupLeader(group) && (
                      <span className="member-status">Member</span>
                    )}
                    <Link className="btn btn-small" to={`/groups/${group.id}`}>View details</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="card page-card">
          <div className="state-card state-card-empty">
            <h3>Please sign in to view groups</h3>
            <p>You need to be logged in to browse and join study groups.</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default GroupList;
