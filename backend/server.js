import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emp';

app.use(express.json());
app.use(cors());

const empSchema = new mongoose.Schema(
    {
        empId: { type: Number, required: true, unique: true, min: 1 },
        empName: { type: String, required: true, trim: true },
        des: { type: String, required: true, trim: true },
        dept: { type: String, required: true, trim: true },
        join: { type: String, required: true }
    },
    { timestamps: true }
);

const Emp = mongoose.model('Emp', empSchema);

// Parse and validate the :id route param. Returns a number, or null if invalid.
function parseId(raw) {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

app.post('/emp', async (req, res) => {
    const { empId, empName, des, dept, join } = req.body;
    try {
        const emp = new Emp({ empId, empName, des, dept, join });
        await emp.save();
        return res.status(201).json(emp);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: `Employee with ID ${empId} already exists` });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
});

app.get('/emp/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid employee ID' });
    try {
        const emp = await Emp.findOne({ empId: id });
        if (!emp) return res.status(404).json({ error: 'Employee not found' });
        return res.json(emp);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.put('/emp/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid employee ID' });
    if (!req.body.des || !req.body.des.trim()) {
        return res.status(400).json({ error: 'Designation is required' });
    }
    try {
        const emp = await Emp.findOneAndUpdate(
            { empId: id },
            { $set: { des: req.body.des.trim() } },
            { new: true, runValidators: true }
        );
        if (!emp) return res.status(404).json({ error: 'Employee not found' });
        return res.json(emp);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.delete('/emp/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid employee ID' });
    try {
        const emp = await Emp.findOneAndDelete({ empId: id });
        if (!emp) return res.status(404).json({ error: 'Employee not found' });
        return res.json(emp);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

await mongoose.connect(MONGO_URI);
await Emp.syncIndexes();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
