import { useEffect, useState } from 'react';
import api from '../services/api';

function InvitesPage() {
  const [invites, setInvites] = useState([]);

  const loadInvites = async () => {
    try {
      const res = await api.get('/invites/pending');
      setInvites(Array.isArray(res.data) ? res.data : []);
    } catch {
      setInvites([]);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const respond = async (inviteId, response) => {
    await api.post(`/invites/${inviteId}/respond`, { response });
    loadInvites();
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <h2>Invites</h2>
        <p>Accept or decline group invites from leaders.</p>
      </header>

      <section className="card page-card">
        {invites.length ? invites.map((invite) => (
          <div className="invite-row" key={invite.id}>
            <span>{invite.groupName || 'Study Group'} invited you</span>
            <div className="invite-actions">
              <button className="btn btn-primary btn-small" onClick={() => respond(invite.id, 'accept')}>Accept</button>
              <button className="btn btn-secondary btn-small" onClick={() => respond(invite.id, 'decline')}>Decline</button>
            </div>
          </div>
        )) : <p>No pending invites.</p>}
      </section>
    </main>
  );
}

export default InvitesPage;
