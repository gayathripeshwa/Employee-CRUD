import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Navbar from './Navbar';

// Wrap a page with this to block people who shouldn't see it.
//   <ProtectedRoute>                 → must be logged in
//   <ProtectedRoute adminOnly>       → must be logged in AND an admin
// Every protected page also gets the navigation bar on top.
function ProtectedRoute({ children, adminOnly = false }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/employees" replace />;
    }
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}

export default ProtectedRoute;
