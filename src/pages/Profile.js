import { useEffect, useState } from 'react';
import api from '../services/api';
import { saveUser } from '../services/auth';

function Profile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    program: '',
    year: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/users/me');
        const data = res.data || {};
        setForm({
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'student',
          program: data.program || '',
          year: data.year ?? ''
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setError('');
    setMessage('');

    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      program: form.role === 'student' ? form.program : undefined,
      year: form.role === 'student' ? form.year : undefined
    };

    setSaving(true);

    try {
      const res = await api.put('/users/me', payload);
      saveUser(res.data);
      setMessage('Profile updated successfully.');
      setForm((prev) => ({
        ...prev,
        name: res.data.name || prev.name,
        program: res.data.program || '',
        year: res.data.year ?? ''
      }));
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>My Profile</h2>
        <p>Update your account details.</p>
      </header>

      <section className="card form-card page-card">
        {loading ? <p>Loading profile...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {message ? <p className="form-success">{message}</p> : null}

        {!loading ? (
          <>
            <input
              className="form-input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              disabled={saving}
            />
            <input className="form-input" value={form.email} disabled />
            <input className="form-input" value={form.role} disabled />

            {form.role === 'student' ? (
              <>
                <input
                  className="form-input"
                  placeholder="Program"
                  value={form.program}
                  onChange={(e) => setForm((prev) => ({ ...prev, program: e.target.value }))}
                  disabled={saving}
                />
                <input
                  className="form-input"
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                  disabled={saving}
                />
              </>
            ) : null}

            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </>
        ) : null}
      </section>
    </main>
  );
}

export default Profile;
