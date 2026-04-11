import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GroupChat from './pages/GroupChat';
import CreateSession from './pages/CreateSession';

<Route path="/create-group" element={<CreateGroup />} />
<Route path="/chat" element={<GroupChat />} />
<Route path="/session" element={<CreateSession />} />
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* pages will come later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;