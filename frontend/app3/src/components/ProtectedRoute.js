import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Wrap a page with this to block people who shouldn't see it.
//   <ProtectedRoute>                 → must be logged in
//   <ProtectedRoute adminOnly>       → must be logged in AND an admin
function ProtectedRoute({ children, adminOnly = false }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;
