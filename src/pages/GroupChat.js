import { useState } from 'react';
import api from '../services/api';

function GroupChat({ groupId }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    await api.post(`/posts/${groupId ?? ''}`, { content: message });
    setMessage("");
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Group Chat</h2>
        <p>Send messages to your study group.</p>
      </header>
      <section className="card page-card chat-card">
        <input className="form-input" value={message} onChange={e => setMessage(e.target.value)} />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </section>
    </main>
  );
}

export default GroupChat;