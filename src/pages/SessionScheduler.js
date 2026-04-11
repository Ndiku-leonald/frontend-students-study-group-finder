import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function SessionScheduler() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    groupId: '',
    date: '',
    time: '',
    location: '',
    agenda: '',
  });

  const handleSubmit = async () => {
    await api.post('/sessions/create', form);
    navigate('/dashboard/student');
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Session Scheduler</h2>
        <p>Leaders can schedule upcoming study sessions.</p>
      </header>

      <section className="card form-card page-card">
        <input className="form-input" placeholder="Group ID" value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })} />
        <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="form-input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        <input className="form-input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <textarea className="form-input form-textarea" placeholder="Agenda" value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} />
        <button className="btn btn-primary" onClick={handleSubmit}>Create session</button>
      </section>
    </main>
  );
}

export default SessionScheduler;
