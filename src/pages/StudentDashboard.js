import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function StudentDashboard() {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [groupsRes, sessionsRes, recentRes] = await Promise.allSettled([
        api.get('/users/me/groups'),
        api.get('/users/me/sessions/upcoming'),
        api.get('/groups/recent'),
      ]);

      if (groupsRes.status === 'fulfilled') setJoinedGroups(groupsRes.value.data || []);
      if (sessionsRes.status === 'fulfilled') setUpcomingSessions(sessionsRes.value.data || []);
      if (recentRes.status === 'fulfilled') setRecentGroups(recentRes.value.data || []);
    };

    loadData();
  }, []);

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Student Dashboard</h2>
        <p>Track your groups, sessions, and recent activity.</p>
      </header>

      <section className="card page-card detail-grid">
        <article className="detail-panel">
          <h3>Joined Groups</h3>
          {joinedGroups.length ? joinedGroups.map((group) => (
            <p key={group.id}>{group.name}</p>
          )) : <p>No joined groups.</p>}
          <Link className="btn btn-secondary btn-small" to="/groups">Browse groups</Link>
        </article>

        <article className="detail-panel">
          <h3>Upcoming Sessions</h3>
          {upcomingSessions.length ? upcomingSessions.map((session) => (
            <p key={session.id}>{session.date} {session.time}</p>
          )) : <p>No upcoming sessions.</p>}
        </article>

        <article className="detail-panel">
          <h3>Recent Groups</h3>
          {recentGroups.length ? recentGroups.map((group) => (
            <p key={group.id}>{group.name}</p>
          )) : <p>No recent groups yet.</p>}
        </article>
      </section>
    </main>
  );
}

export default StudentDashboard;
