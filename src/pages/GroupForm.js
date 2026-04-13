import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function GroupForm() {
  // One form supports both create and edit flows so the UI stays compact.
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(groupId);
  const [form, setForm] = useState({
    name: '',
    title: '',
    course: '',
    faculty: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const loadGroup = async () => {
      // Prefill the form when editing an existing group.
      const res = await api.get(`/groups/${groupId}`);
      setForm({
        name: res.data.name || '',
        title: res.data.title || '',
        course: res.data.course || '',
        faculty: res.data.faculty || '',
        description: res.data.description || '',
      });
    };

    loadGroup();
  }, [groupId, isEdit]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.course.trim()) {
      setError('Group name and course are required.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      if (isEdit) {
        await api.put(`/groups/${groupId}`, form);
      } else {
        await api.post('/groups/create', form);
      }

      navigate('/groups');
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || 'Failed to save group. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>{isEdit ? 'Edit Group' : 'Create Group'}</h2>
        <p>Leaders can create and update study groups here.</p>
      </header>

      <section className="card form-card page-card">
        {error ? <p className="form-error">{error}</p> : null}
        <input className="form-input" placeholder="Group name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="form-input" placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
        <input className="form-input" placeholder="Faculty" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} />
        <textarea className="form-input form-textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving...' : (isEdit ? 'Save changes' : 'Create group')}</button>
      </section>
    </main>
  );
}

export default GroupForm;
