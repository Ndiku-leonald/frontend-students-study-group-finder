import { useEffect, useState } from 'react';
import axios from 'axios';
<h3>Welcome, User!</h3>
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
<input 
  placeholder="Search"
  onChange={async (e) => {
    const res = await axios.get(`http://localhost:5000/api/groups/search?query=${e.target.value}`);
    setGroups(res.data);
  }}
/>;
<button onClick={async () => {
  await axios.post(`http://localhost:5000/api/favorites/${g.id}`, {}, {
    headers: { Authorization: localStorage.getItem("token") }
  });
}}>
  ❤️ Save
</button>
export default Dashboard;
<button>❤️ Save</button>