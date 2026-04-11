import { useState } from 'react';
import axios from 'axios';

function GroupChat({ groupId }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    await axios.post(
      http://localhost:5000/api/posts/${groupId},
      { content: message },
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    setMessage("");
  };

  return (
    <div>
      <h3>Group Chat</h3>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
<div className="card">
  <h3>Group Chat</h3>
</div>
export default GroupChat;