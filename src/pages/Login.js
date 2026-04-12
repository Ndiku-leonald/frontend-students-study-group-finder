import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken } from '../services/auth';
import api from '../services/api';

function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    try {
      const res = await api.post('/auth/login', form);
      saveToken(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check the backend route and your credentials.');
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <header className="auth-header">
          <h1>UCU Study Group Finder</h1>
          <p>Sign in to continue</p>
        </header>
        <div className="card form-card">
          <h2>Login</h2>
          <p className="form-subtitle">Welcome back. Enter your account details.</p>
          {error ? <p className="form-error">{error}</p> : null}
          <input className="form-input" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
          <input className="form-input" placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})}/>
          <button className="btn btn-primary" onClick={handleSubmit}>Login</button>
          <p className="auth-switch">
            New here? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;