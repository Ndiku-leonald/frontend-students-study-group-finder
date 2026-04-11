import { useState } from 'react';
import api from '../services/api';

function CreateGroup() {
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    await api.post('/groups/create', form);
    alert("Group created");
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Create Group</h2>
        <p>Set up a new study space for your course.</p>
      </header>
      <section className="card form-card page-card">
        <input className="form-input" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
        <input className="form-input" placeholder="Course" onChange={e => setForm({...form, course: e.target.value})}/>
        <textarea className="form-input form-textarea" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})}/>
        <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
      </section>
    </main>
  );
}

export default CreateGroup;