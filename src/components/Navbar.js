import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <h2>Study Finder</h2>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/create-group">Create Group</Link>
      <Link to="/chat">Chat</Link>
      <Link to="/session">Session</Link>
      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;