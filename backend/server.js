import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import empRoutes from './routes/emp.js';
import Emp from './models/Emp.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emp';

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Add a line like JWT_SECRET=some-long-random-text to backend/.env');
    process.exit(1);
}

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Employee API is running' });
});

// /auth/register and /auth/login (public — no token needed)
app.use('/auth', authRoutes);

// /emp ... (see routes/emp.js for who can do what)
app.use('/emp', empRoutes);

await mongoose.connect(MONGO_URI);
await Emp.syncIndexes(); // creates the unique indexes on empId and email

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
