import { useState } from 'react';
import axios from 'axios';

function CreateGroup() {
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    await axios.post(
      'http://localhost:5000/api/groups/create',
      form,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    alert("Group created");
  };

  return (
    <div>
      <h2>Create Group</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
      <input placeholder="Course" onChange={e => setForm({...form, course: e.target.value})}/>
      <textarea placeholder="Description" onChange={e => setForm({...form, description: e.target.value})}/>
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}

export default CreateGroup;