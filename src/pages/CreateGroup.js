import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getToken } from '../services/auth';

function CreateGroup() {
  // Keep the form minimal because the backend only requires a few core fields.
  const [form, setForm] = useState({
    name: '',
    course: '',
    faculty: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const isAuthenticated = !!getToken();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to create a group.');
      return;
    }

    if (!form.name.trim() || !form.course.trim()) {
      setError('Group name and course are required.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/groups/create', form);
      setSuccess('Group created successfully!');
      // Return to the directory after a short pause so the success message is visible.
      setTimeout(() => {
        navigate('/groups');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create group. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="page-content">
        <section className="card page-card">
          <div className="state-card state-card-empty">
            <h3>Please sign in to create a group</h3>
            <p>You need to be logged in to create study groups.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">Sign In</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Create Group</h2>
        <p>Set up a new study space for your course.</p>
      </header>
      <section className="card form-card page-card">
        {success && <p className="form-success">{success}</p>}
        {error && <p className="form-error">{error}</p>}

        <input
          className="form-input"
          placeholder="Group Name *"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          disabled={loading}
        />
        <input
          className="form-input"
          placeholder="Course *"
          value={form.course}
          onChange={e => setForm({...form, course: e.target.value})}
          disabled={loading}
        />
        <input
          className="form-input"
          placeholder="Faculty (optional)"
          value={form.faculty}
          onChange={e => setForm({...form, faculty: e.target.value})}
          disabled={loading}
        />
        <input
          className="form-input"
          placeholder="Location (optional)"
          value={form.location}
          onChange={e => setForm({...form, location: e.target.value})}
          disabled={loading}
        />
        <textarea
          className="form-input form-textarea"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </section>
    </main>
  );
}

export default CreateGroup;