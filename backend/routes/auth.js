import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Build a signed token that says "this is user X with role Y".
// Anyone can READ a JWT, but only the server (which knows JWT_SECRET) can CREATE
// a valid one — so the server can trust the contents when it gets it back.
function createToken(user) {
    return jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

// What we send back to the frontend about a user (never the password hash).
function publicUser(user) {
    return { id: user._id, name: user.name, email: user.email, role: user.role };
}

// POST /auth/register  { name, email, password }
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        // Hash the password. 10 = "salt rounds": how much work hashing takes.
        const hashedPassword = await bcrypt.hash(password, 10);

        // The very first account becomes the admin; everyone after is a normal user.
        const isFirstUser = (await User.countDocuments()) === 0;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: isFirstUser ? 'admin' : 'user'
        });

        return res.status(201).json({ token: createToken(user), user: publicUser(user) });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// POST /auth/login  { email, password }
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // bcrypt.compare hashes the typed password and checks it against the stored hash.
        const passwordOk = user && (await bcrypt.compare(password, user.password));

        // Same message for "no such user" and "wrong password", so attackers
        // can't use this form to find out which emails have accounts.
        if (!passwordOk) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        return res.json({ token: createToken(user), user: publicUser(user) });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
