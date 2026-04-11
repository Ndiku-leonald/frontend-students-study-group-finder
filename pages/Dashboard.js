import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/groups')
      .then(res => setGroups(res.data));
  }, []);

  return (
    <div>
      <h2>Groups</h2>
      {groups.map(g => (
        <div key={g.id}>
          <h3>{g.name}</h3>
          <p>{g.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;