import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken } from '../services/auth';
import api from '../services/api';

function Register() {
  const [form, setForm] = useState({
    name: '',
    fullName: '',
    email: '',
    password: '',
    program: '',
    course: '',
    year: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    const displayName = (form.fullName || form.name || '').trim();
    const email = (form.email || '').trim();

    if (!displayName || !email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }

    try {
      const primaryPayload = {
        name: displayName,
        email,
        password: form.password,
        role: form.role || 'student',
      };

      let registerResponse;

      try {
        registerResponse = await api.post('/auth/register', primaryPayload);
      } catch (primaryErr) {
        const shouldRetry = [400, 404, 422].includes(primaryErr?.response?.status);

        if (!shouldRetry) {
          throw primaryErr;
        }

        const fallbackPayload = {
          name: displayName,
          fullName: displayName,
          email,
          password: form.password,
          role: form.role || 'student',
        };

        if (form.program?.trim()) fallbackPayload.program = form.program.trim();
        if (form.course?.trim()) fallbackPayload.course = form.course.trim();
        if (form.year?.toString().trim()) fallbackPayload.year = form.year.toString().trim();

        registerResponse = await api.post('/auth/register', fallbackPayload);
      }

      const registerToken = registerResponse?.data?.token;
      if (registerToken) {
        saveToken(registerToken);
        navigate('/');
        return;
      }

      const loginResponse = await api.post('/auth/login', {
        email,
        password: form.password,
      });

      if (loginResponse?.data?.token) {
        saveToken(loginResponse.data.token);
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
          <p className="form-subtitle">Create an account to join and manage study groups.</p>
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
          <input className="form-input" placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          <input className="form-input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="form-input" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <input className="form-input" placeholder="Program or course" value={form.program} onChange={e => setForm({ ...form, program: e.target.value, course: e.target.value })} />
          <input className="form-input" placeholder="Year" type="number" min="1" max="10" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
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