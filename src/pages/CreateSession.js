import { useState } from 'react';
import api from '../services/api';

function CreateSession() {
  // This lightweight form creates a session without forcing a full group editor.
  const [form, setForm] = useState({ groupId: '', date: '', time: '', location: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');
      await api.post('/sessions/create', form);
      setSuccess('Session created');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create session');
    }
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Create Session</h2>
        <p>Schedule a study time and location for your group.</p>
      </header>
      <section className="card form-card page-card">
        {error ? <p className="form-error">{error}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}
        <input className="form-input" placeholder="Group ID" onChange={e => setForm({...form, groupId: e.target.value})}/>
        <input className="form-input" type="date" onChange={e => setForm({...form, date: e.target.value})}/>
        <input className="form-input" type="time" onChange={e => setForm({...form, time: e.target.value})}/>
        <input className="form-input" placeholder="Location" onChange={e => setForm({...form, location: e.target.value})}/>
        <textarea className="form-input form-textarea" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})}/>
        <button className="btn btn-primary" onClick={handleSubmit}>Create Session</button>
      </section>
    </main>
  );
}

export default CreateSession;