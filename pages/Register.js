import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/api/auth/register', form);
    alert("Registered");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
      <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})}/>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default Register;