import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUserId, getUserRole } from '../services/auth';

function SessionScheduler() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    groupId: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const role = getUserRole();
        const endpoint = role === 'admin' ? '/groups' : '/users/me/groups';
        const res = await api.get(endpoint);
        const list = Array.isArray(res.data) ? res.data : [];
        const filtered = role === 'admin' ? list : list.filter((group) => Number(group.userId) === Number(getUserId()));
        setGroups(filtered);
      } catch (err) {
        setError('Failed to load groups for scheduling.');
      }
    };

    loadGroups();
  }, []);

  const handleSubmit = async () => {
    if (!form.groupId || !form.date || !form.time || !form.location.trim()) {
      setError('Group, date, time, and location are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await api.post('/sessions/create', form);
      navigate('/groups/' + form.groupId);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to schedule session.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Session Scheduler</h2>
        <p>Leaders can schedule upcoming study sessions.</p>
      </header>

      <section className="card form-card page-card">
        {error ? <p className="form-error">{error}</p> : null}
        <select className="form-input" value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}>
          <option value="">Select group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
        <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="form-input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        <input className="form-input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <textarea className="form-input form-textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Scheduling...' : 'Create session'}</button>
      </section>
    </main>
  );
}

export default SessionScheduler;
