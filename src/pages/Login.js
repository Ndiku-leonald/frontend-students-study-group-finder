import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken, saveUser } from '../services/auth';
import api from '../services/api';

function Login() {
  // Keep the role and admin access code in the form so one screen handles both logins.
  const [form, setForm] = useState({ role: 'student', accessCode: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Validate the minimum credentials before calling the API.
    setError('');

    if (!(form.email || '').trim() || !(form.password || '').trim()) {
      setError('Email and password are required.');
      return;
    }

    if (form.role === 'admin' && !form.accessCode.trim()) {
      setError('Admin access code is required.');
      return;
    }

    try {
      // Normalize user input so the backend gets predictable values.
      const payload = {
        ...form,
        email: (form.email || '').trim().toLowerCase(),
        accessCode: (form.accessCode || '').trim()
      };

      const res = await api.post('/auth/login', payload);
      saveToken(res.data.token);
      saveUser(res.data.user);
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
          <h2>{form.role === 'admin' ? 'Admin Login' : 'Student Login'}</h2>
          <p className="form-subtitle">Choose your account type and sign in.</p>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="role-toggle" role="radiogroup" aria-label="Login type">
            <label className={`role-option ${form.role === 'student' ? 'role-option-active' : ''}`}>
              <input
                type="radio"
                name="loginRole"
                value="student"
                checked={form.role === 'student'}
                onChange={e => setForm({ ...form, role: e.target.value })}
              />
              <span>
                <strong>Student</strong>
                <small>Browse and join study groups</small>
              </span>
            </label>
            <label className={`role-option ${form.role === 'admin' ? 'role-option-active' : ''}`}>
              <input
                type="radio"
                name="loginRole"
                value="admin"
                checked={form.role === 'admin'}
                onChange={e => setForm({ ...form, role: e.target.value })}
              />
              <span>
                <strong>Administrator</strong>
                <small>Manage the platform</small>
              </span>
            </label>
          </div>
          <input className="form-input" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
          <input className="form-input" placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})}/>
          {form.role === 'admin' ? (
            <input className="form-input" placeholder="Admin access code" value={form.accessCode} onChange={e => setForm({ ...form, accessCode: e.target.value })}/>
          ) : null}
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