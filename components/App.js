import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

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