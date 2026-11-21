import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeList from './components/EmployeeList';
import EmployeeProfile from './components/EmployeeProfile';
import AddEmp from './components/AddEmp';
import EditEmp from './components/EditEmp';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Any logged-in user */}
        <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />

        {/* Admins only */}
        <Route path="/employees/new" element={<ProtectedRoute adminOnly><AddEmp /></ProtectedRoute>} />
        <Route path="/employees/:id/edit" element={<ProtectedRoute adminOnly><EditEmp /></ProtectedRoute>} />

        {/* The home page is the directory; unknown addresses go there too */}
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="*" element={<Navigate to="/employees" replace />} />
      </Routes>
    </div>
  );
}

export default App;
