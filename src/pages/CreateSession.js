import { useState } from 'react';
import api from '../services/api';

function CreateSession() {
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    await api.post('/sessions/create', form);
    alert("Session created");
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Create Session</h2>
        <p>Schedule a study time and location for your group.</p>
      </header>
      <section className="card form-card page-card">
        <input className="form-input" placeholder="Group ID" onChange={e => setForm({...form, groupId: e.target.value})}/>
        <input className="form-input" type="date" onChange={e => setForm({...form, date: e.target.value})}/>
        <input className="form-input" placeholder="Time" onChange={e => setForm({...form, time: e.target.value})}/>
        <input className="form-input" placeholder="Location" onChange={e => setForm({...form, location: e.target.value})}/>
        <button className="btn btn-primary" onClick={handleSubmit}>Create Session</button>
      </section>
    </main>
  );
}

export default CreateSession;