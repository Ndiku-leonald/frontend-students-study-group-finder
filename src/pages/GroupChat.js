import { useEffect, useState } from 'react';
import api from '../services/api';
import { getUserRole } from '../services/auth';

function GroupChat() {
  const [groupId, setGroupId] = useState('');
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const loadData = async (selectedGroupId) => {
    if (!selectedGroupId) return;
    const [postsRes, filesRes] = await Promise.all([
      api.get(`/posts/${selectedGroupId}`),
      api.get(`/posts/${selectedGroupId}/files`)
    ]);
    setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
    setFiles(Array.isArray(filesRes.data) ? filesRes.data : []);
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const role = getUserRole();
        const endpoint = role === 'admin' ? '/groups' : '/users/me/groups';
        const res = await api.get(endpoint);
        const list = Array.isArray(res.data) ? res.data : [];
        setGroups(list);
      } catch (err) {
        setError('Failed to load groups for chat.');
      }
    };

    loadGroups();
  }, []);

  const sendMessage = async () => {
    if (!groupId) {
      setError('Select a group first.');
      return;
    }
    if (!message.trim()) return;

    try {
      await api.post(`/posts/${groupId}`, { content: message.trim() });
      setMessage("");
      await loadData(groupId);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send message.');
    }
  };

  const uploadFile = async () => {
    if (!groupId) {
      setError('Select a group first.');
      return;
    }
    if (!selectedFile) {
      setError('Choose a file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      await api.post(`/posts/${groupId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedFile(null);
      await loadData(groupId);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload file.');
    }
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Group Chat</h2>
        <p>Send messages to your study group.</p>
      </header>
      <section className="card page-card chat-card">
        {error ? <p className="form-error">{error}</p> : null}
        <select className="form-input" value={groupId} onChange={async (e) => { const next = e.target.value; setGroupId(next); setError(''); await loadData(next); }}>
          <option value="">Select group to chat</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>

        <div className="detail-panel">
          <h3>Messages</h3>
          {posts.length ? posts.map((post) => (
            <p key={post.id}><strong>{post.User?.name || 'Member'}:</strong> {post.content}</p>
          )) : <p>No messages yet.</p>}
        </div>

        <input className="form-input" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message" />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>

        <div className="detail-panel">
          <h3>Files</h3>
          {files.length ? files.map((file) => (
            <p key={file.id}>
              <a href={`http://localhost:5000${file.fileUrl}`} target="_blank" rel="noreferrer">{file.originalName}</a> by {file.User?.name || 'Member'}
            </p>
          )) : <p>No files uploaded yet.</p>}
        </div>

        <input className="form-input" type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
        <button className="btn btn-secondary" onClick={uploadFile}>Upload File</button>
      </section>
    </main>
  );
}

export default GroupChat;