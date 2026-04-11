import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalSessions: 0,
    activeCourses: [],
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/admin/overview');
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalGroups: res.data.totalGroups || 0,
          totalSessions: res.data.totalSessions || 0,
          activeCourses: res.data.activeCourses || [],
        });
      } catch {
        setStats((prev) => ({ ...prev }));
      }
    };

    loadStats();
  }, []);

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Monitor users, groups, sessions, and course activity.</p>
      </header>

      <section className="card page-card metrics-grid">
        <article className="mini-metric"><h3>{stats.totalUsers}</h3><p>Total Users</p></article>
        <article className="mini-metric"><h3>{stats.totalGroups}</h3><p>Total Groups</p></article>
        <article className="mini-metric"><h3>{stats.totalSessions}</h3><p>Total Sessions</p></article>
      </section>

      <section className="card page-card">
        <h3 className="section-title">Most Active Courses</h3>
        {(stats.activeCourses || []).length ? (
          (stats.activeCourses || []).map((course, index) => (
            <p key={`${course.name}-${index}`}>{course.name}: {course.activityCount || 0} activities</p>
          ))
        ) : (
          <p>No activity data available.</p>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
