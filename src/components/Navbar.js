import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clearToken, getUserDisplayName, getUserRole } from '../services/auth';

function Navbar() {
  const [displayName, setDisplayName] = useState(getUserDisplayName());
  const [role, setRole] = useState(getUserRole());

  useEffect(() => {
    setDisplayName(getUserDisplayName());
    setRole(getUserRole());
  }, []);

  const roleLabel = role === 'admin' ? 'Administrator' : 'Student';
  const roleBadgeClass = role === 'admin' ? 'sidebar-role-badge sidebar-role-badge-admin' : 'sidebar-role-badge sidebar-role-badge-student';
  const avatarText = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'SG';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>UCU Study Group Finder</h1>
        <span>find your droup learn with ease</span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">{avatarText}</div>
        <div className="sidebar-user-text">
          <div className="sidebar-user-name">{displayName}</div>
          <div className="sidebar-user-role">{roleLabel}</div>
        </div>
        <div className={roleBadgeClass}>{roleLabel}</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-label">Navigation</div>
        <Link to="/" className="sidebar-link">Home</Link>
        {role === 'student' ? <Link to="/dashboard/student" className="sidebar-link">Student Dashboard</Link> : null}
        {role === 'admin' ? <Link to="/dashboard/admin" className="sidebar-link">Admin Dashboard</Link> : null}
        <Link to="/groups" className="sidebar-link">Group Directory</Link>
        <Link to="/groups/new" className="sidebar-link">Create Group</Link>
        <Link to="/leaders/sessions/new" className="sidebar-link">Schedule Session</Link>
        <Link to="/invites" className="sidebar-link">Invites</Link>
        <Link to="/profile" className="sidebar-link">My Profile</Link>
        <Link to="/chat" className="sidebar-link">Group Chat</Link>
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={() => {
            clearToken();
            window.location.href = '/login';
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Navbar;