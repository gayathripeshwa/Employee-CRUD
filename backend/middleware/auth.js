import jwt from 'jsonwebtoken';

// Runs BEFORE a protected route. Lets the request through only if it carries
// a valid token in the header:  Authorization: Bearer <token>
export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        // verify() checks the signature and the expiry date.
        // If it's valid, it gives back what we put in: { id, name, role }.
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return next(); // go on to the actual route
    } catch {
        return res.status(401).json({ error: 'Session expired, please log in again' });
    }
}

// Use AFTER requireAuth. Only lets admins through.
export function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can do this' });
    }
    return next();
}
