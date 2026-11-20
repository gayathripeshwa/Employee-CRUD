import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AddEmp from './components/AddEmp';
import SearchEmp from './components/SearchEmp';
import UpdateEmp from './components/UpdateEmp';
import DeleteEmp from './components/DeleteEmp';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Any logged-in user */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchEmp /></ProtectedRoute>} />

        {/* Admins only */}
        <Route path="/add" element={<ProtectedRoute adminOnly><AddEmp /></ProtectedRoute>} />
        <Route path="/update" element={<ProtectedRoute adminOnly><UpdateEmp /></ProtectedRoute>} />
        <Route path="/delete" element={<ProtectedRoute adminOnly><DeleteEmp /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
