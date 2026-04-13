import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { getUserId } from '../services/auth';

function GroupDetail() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [memberError, setMemberError] = useState('');
  const [memberSuccess, setMemberSuccess] = useState('');
  const [postCommentDrafts, setPostCommentDrafts] = useState({});

  const currentUserId = getUserId();

  const loadGroupData = async () => {
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

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      setInviteError('');
      await api.post(`/groups/${groupId}/invites`, { email: inviteEmail.trim() });
      setInviteEmail('');
    } catch (err) {
      setInviteError(err?.response?.data?.message || 'Failed to send invite.');
    }
  };

  const handleInviteResponse = async (inviteId, response) => {
    await api.post(`/invites/${inviteId}/respond`, { response });
  };

  const handleCommentChange = (postId, value) => {
    setPostCommentDrafts((prev) => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleAddComment = async (postId) => {
    const content = (postCommentDrafts[postId] || '').trim();
    if (!content) return;

    await api.post(`/comments/post/${postId}`, { content });
    await loadGroupData();
    setPostCommentDrafts((prev) => ({
      ...prev,
      [postId]: ''
    }));
  };

  const handleCreatePost = async () => {
    const content = newPost.trim();
    if (!content) return;

    await api.post(`/posts/${groupId}`, { content });
    setNewPost('');
    await loadGroupData();
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setMemberError('');
      setMemberSuccess('');
      await api.delete(`/groups/${groupId}/members/${memberId}`);
      setMemberSuccess('Member removed successfully.');
      await loadGroupData();
    } catch (err) {
      setMemberError(err?.response?.data?.message || 'Failed to remove member.');
    }
  };

  const isLeader = Number(group?.userId) === Number(currentUserId);

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>{group?.name || 'Group Details'}</h2>
        <p>{group?.description || 'Review members, sessions, posts, and invites.'}</p>
      </header>

      <section className="card page-card detail-grid">
        <article className="detail-panel">
          <h3>Members</h3>
          {memberError ? <p className="form-error">{memberError}</p> : null}
          {memberSuccess ? <p className="form-success">{memberSuccess}</p> : null}
          {members.length ? members.map((member) => (
            <div key={member.id || member.email} className="group-item">
              <p>{member.name || member.email}</p>
              {isLeader && Number(member.id) !== Number(currentUserId) ? (
                <button className="btn btn-secondary btn-small" onClick={() => handleRemoveMember(member.id)}>
                  Remove
                </button>
              ) : null}
            </div>
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
          <div className="inline-form">
            <input
              className="form-input"
              placeholder="Share an announcement or question"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button className="btn btn-primary btn-small" onClick={handleCreatePost}>Post</button>
          </div>
          {posts.length ? posts.map((post) => (
            <div key={post.id} className="post-block">
              <p><strong>{post.User?.name || 'Member'}:</strong> {post.content}</p>
              <div className="comments-list">
                {(post.Comments || []).length ? (post.Comments || []).map((comment) => (
                  <p key={comment.id} className="comment-line">
                    <strong>{comment.User?.name || 'Member'}:</strong> {comment.content}
                  </p>
                )) : <p>No comments yet.</p>}
              </div>
              <div className="inline-form">
                <input
                  className="form-input"
                  placeholder="Add a comment"
                  value={postCommentDrafts[post.id] || ''}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                />
                <button className="btn btn-secondary btn-small" onClick={() => handleAddComment(post.id)}>Comment</button>
              </div>
            </div>
          )) : <p>No posts yet.</p>}
        </article>

        <article className="detail-panel">
          <h3>Invite Students</h3>
          {isLeader ? (
            <>
              {inviteError ? <p className="form-error">{inviteError}</p> : null}
              <div className="inline-form">
                <input
                  className="form-input"
                  placeholder="Student email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button className="btn btn-primary btn-small" onClick={handleInvite}>Send invite</button>
              </div>
            </>
          ) : (
            <p>Only the group leader can send invites.</p>
          )}

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
