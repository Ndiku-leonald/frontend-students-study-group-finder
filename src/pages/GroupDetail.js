import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

function GroupDetail() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      const [groupRes, membersRes, sessionsRes, postsRes] = await Promise.allSettled([
        api.get(`/groups/${groupId}`),
        api.get(`/groups/${groupId}/members`),
        api.get(`/groups/${groupId}/sessions`),
        api.get(`/groups/${groupId}/posts`),
      ]);

      if (groupRes.status === 'fulfilled') setGroup(groupRes.value.data);
      if (membersRes.status === 'fulfilled') setMembers(Array.isArray(membersRes.value.data) ? membersRes.value.data : []);
      if (sessionsRes.status === 'fulfilled') setSessions(Array.isArray(sessionsRes.value.data) ? sessionsRes.value.data : []);
      if (postsRes.status === 'fulfilled') setPosts(Array.isArray(postsRes.value.data) ? postsRes.value.data : []);
    };

    fetchGroup();
  }, [groupId]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    await api.post(`/groups/${groupId}/invites`, { email: inviteEmail.trim() });
    setInviteEmail('');
  };

  const handleInviteResponse = async (inviteId, response) => {
    await api.post(`/invites/${inviteId}/respond`, { response });
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>{group?.name || 'Group Details'}</h2>
        <p>{group?.description || 'Review members, sessions, posts, and invites.'}</p>
      </header>

      <section className="card page-card detail-grid">
        <article className="detail-panel">
          <h3>Members</h3>
          {members.length ? members.map((member) => (
            <p key={member.id || member.email}>{member.name || member.email}</p>
          )) : <p>No members listed.</p>}
        </article>

        <article className="detail-panel">
          <h3>Sessions</h3>
          {sessions.length ? sessions.map((session) => (
            <p key={session.id}>{session.date} {session.time} at {session.location}</p>
          )) : <p>No sessions yet.</p>}
          <Link to="/leaders/sessions/new" className="btn btn-secondary btn-small">Schedule session</Link>
        </article>

        <article className="detail-panel">
          <h3>Posts</h3>
          {posts.length ? posts.map((post) => (
            <p key={post.id}>{post.content}</p>
          )) : <p>No posts yet.</p>}
        </article>

        <article className="detail-panel">
          <h3>Invite Students</h3>
          <div className="inline-form">
            <input
              className="form-input"
              placeholder="Student email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button className="btn btn-primary btn-small" onClick={handleInvite}>Send invite</button>
          </div>

          {(group?.pendingInvites || []).map((invite) => (
            <div className="invite-row" key={invite.id}>
              <span>{invite.email}</span>
              <div className="invite-actions">
                <button className="btn btn-secondary btn-small" onClick={() => handleInviteResponse(invite.id, 'accept')}>Accept</button>
                <button className="btn btn-secondary btn-small" onClick={() => handleInviteResponse(invite.id, 'decline')}>Decline</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}

export default GroupDetail;
