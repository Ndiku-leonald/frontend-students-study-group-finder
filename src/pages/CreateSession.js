import { useState } from 'react';
import axios from 'axios';

function CreateSession() {
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    await axios.post(
      'http://localhost:5000/api/sessions/create',
      form
    );
    alert("Session created");
  };

  return (
    <div>
      <h2>Create Session</h2>
      <input placeholder="Group ID" onChange={e => setForm({...form, groupId: e.target.value})}/>
      <input type="date" onChange={e => setForm({...form, date: e.target.value})}/>
      <input placeholder="Time" onChange={e => setForm({...form, time: e.target.value})}/>
      <input placeholder="Location" onChange={e => setForm({...form, location: e.target.value})}/>
      <button onClick={handleSubmit}>Create Session</button>
    </div>
  );
}

export default CreateSession;