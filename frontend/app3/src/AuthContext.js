import { createContext, useContext, useState } from 'react';

// A "context" lets any component read the logged-in user without passing
// it down through props.
const AuthContext = createContext(null);

function readSavedUser() {
    try {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    // Start from whatever was saved, so a page refresh keeps you logged in.
    const [user, setUser] = useState(readSavedUser);

    // Called after a successful login or register.
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Shortcut: const { user, login, logout } = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}
