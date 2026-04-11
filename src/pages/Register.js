import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveToken } from '../services/auth';

const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

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

    try {
      const registerResponse = await authApi.post('/auth/register', {
        name: form.fullName || form.name,
        fullName: form.fullName || form.name,
        email: form.email,
        password: form.password,
        program: form.program || form.course,
        course: form.course || form.program,
        year: form.year,
        role: form.role,
      });

      const registerToken = registerResponse?.data?.token;
      if (registerToken) {
        saveToken(registerToken);
        navigate('/');
        return;
      }

      const loginResponse = await authApi.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      if (loginResponse?.data?.token) {
        saveToken(loginResponse.data.token);
        navigate('/');
        return;
      }

      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please check the backend route and required fields.');
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