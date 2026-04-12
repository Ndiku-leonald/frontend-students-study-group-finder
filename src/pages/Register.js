import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken, saveUser } from '../services/auth';
import api from '../services/api';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    accessCode: '',
    program: '',
    year: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setAdminCode('');

    const displayName = (form.name || '').trim();
    const email = (form.email || '').trim();
    const isAdmin = form.role === 'admin';

    if (!displayName || !email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (isAdmin && !form.accessCode.trim()) {
      setError('Admin access code is required.');
      return;
    }

    if (!isAdmin && (!form.program.trim() || !form.year.trim())) {
      setError('Program and year are required for student accounts.');
      return;
    }

    try {
      const payload = {
        name: displayName,
        email: email.toLowerCase(),
        password: form.password,
        role: form.role || 'student',
        accessCode: form.accessCode.trim(),
      };

      if (!isAdmin) {
        payload.program = form.program.trim();
        payload.year = form.year.trim();
      }

      const registerResponse = await api.post('/auth/register', payload);

      const registerToken = registerResponse?.data?.token;
      if (registerToken) {
        saveToken(registerToken);
        saveUser(registerResponse.data.user);
        if (registerResponse.data.user?.adminCode) {
          setAdminCode(registerResponse.data.user.adminCode);
        }
        navigate('/');
        return;
      }

      const loginResponse = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password: form.password,
        role: form.role,
        accessCode: form.accessCode.trim(),
      });

      if (loginResponse?.data?.token) {
        saveToken(loginResponse.data.token);
        saveUser(loginResponse.data.user);
        if (loginResponse.data.user?.adminCode) {
          setAdminCode(loginResponse.data.user.adminCode);
        }
        navigate('/');
        return;
      }

      navigate('/login');
    } catch (err) {
      const data = err?.response?.data;
      const status = err?.response?.status;
      const detail =
        data?.message
        || data?.error
        || (Array.isArray(data?.errors) ? data.errors.map((item) => item?.message || item).join(', ') : null)
        || err?.message;

      setError(detail ? `Registration failed (${status || 'request'}): ${detail}` : 'Registration failed. Please check the backend route and required fields.');
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <header className="auth-header">
          <h1>UCU Study Group Finder</h1>
          <p>Create your account</p>
        </header>
        <div className="card form-card">
          <h2>Sign up</h2>
          <p className="form-subtitle">Create a student or admin account.</p>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="role-toggle" role="radiogroup" aria-label="Account type">
            <label className={`role-option ${form.role === 'student' ? 'role-option-active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={form.role === 'student'}
                onChange={e => setForm({ ...form, role: e.target.value })}
              />
              <span>
                <strong>Student</strong>
                <small>Join groups and track study sessions</small>
              </span>
            </label>
            <label className={`role-option ${form.role === 'admin' ? 'role-option-active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === 'admin'}
                onChange={e => setForm({ ...form, role: e.target.value })}
              />
              <span>
                <strong>Administrator</strong>
                <small>Manage users, groups, and sessions</small>
              </span>
            </label>
          </div>
          {adminCode ? (
            <p className="form-success">Admin code generated: {adminCode}</p>
          ) : null}
          <input className="form-input" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="form-input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="form-input" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {form.role === 'student' ? (
            <>
              <input className="form-input" placeholder="Program or course" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} />
              <input className="form-input" placeholder="Year" type="number" min="1" max="10" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </>
          ) : (
            <>
              <input className="form-input" placeholder="Admin access code" value={form.accessCode} onChange={e => setForm({ ...form, accessCode: e.target.value })} />
              <p className="form-help">Admin accounts require a valid access code from the admin list.</p>
            </>
          )}
          <button className="btn btn-primary" onClick={handleSubmit}>Create account</button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;