import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroupId, setJoiningGroupId] = useState(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    course: '',
    faculty: '',
  });

  const joinGroup = async (groupId) => {
    setJoinMessage('');
    setJoiningGroupId(groupId);

    try {
      await api.post(`/groups/${groupId}/join`);
      setJoinMessage('You joined the group successfully.');
    } catch {
      try {
        await api.post('/groups/join', { groupId });
        setJoinMessage('You joined the group successfully.');
      } catch {
        setJoinMessage('Unable to join this group right now.');
      }
    } finally {
      setJoiningGroupId(null);
    }
  };

  useEffect(() => {
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
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [filters]);

  const summary = useMemo(() => {
    if (loading) return 'Loading groups...';
    return `${groups.length} group${groups.length === 1 ? '' : 's'} found`;
  }, [groups, loading]);

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Group Directory</h2>
        <p>Search by title, course, or faculty.</p>
      </header>

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
        {joinMessage ? <p className="section-note">{joinMessage}</p> : null}

        {loading ? (
          <div className="state-card">Loading directory...</div>
        ) : (
          <div className="group-grid">
            {groups.map((group) => (
              <article className="group-card" key={group.id}>
                <div className="group-card-top">
                  <div>
                    <div className="group-course">{group.course || 'Study Group'}</div>
                    <h3 className="group-title">{group.name || group.title}</h3>
                  </div>
                  <div className="group-badge">{group.members ?? 0} members</div>
                </div>
                <p className="group-description">{group.description || 'No description available.'}</p>
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => joinGroup(group.id)}
                    disabled={joiningGroupId === group.id}
                  >
                    {joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                  </button>
                  <Link className="btn btn-small" to={`/groups/${group.id}`}>View details</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default GroupList;
