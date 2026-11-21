import express from 'express';
import Emp from '../models/Emp.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Fields an admin may set through the API (empId is set once, on create).
const EDITABLE_FIELDS = ['empName', 'email', 'phone', 'des', 'dept', 'join', 'salary', 'status'];

// Columns the directory can be sorted by.
const SORTABLE_FIELDS = ['empId', 'empName', 'dept', 'join', 'status', 'salary'];

// ---------- helpers ----------

// Parse and validate the :id route param. Returns a number, or null if invalid.
function parseId(raw) {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Salary is private: only admins get to see it.
function hideSalaryFor(req, query) {
    return req.user.role === 'admin' ? query : query.select('-salary');
}

// Treat empty strings from the form as "not given".
function isEmpty(value) {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

// Make search text safe to use inside a regex (so "a.b" doesn't mean "a, any char, b").
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Turn Mongoose/Mongo errors into clear HTTP responses.
function sendError(res, err) {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        const label = field === 'email' ? 'email' : 'ID';
        return res.status(409).json({ error: `An employee with this ${label} already exists` });
    }
    if (err.name === 'ValidationError') {
        // Show only the first problem, e.g. "Please enter a valid email"
        const first = Object.values(err.errors)[0];
        return res.status(400).json({ error: first.message });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ error: `Invalid value for ${err.path}` });
    }
    return res.status(500).json({ error: err.message });
}

// ---------- routes ----------

// GET /emp?search=&dept=&status=&sort=empName&order=asc&page=1&limit=10
// Any logged-in user. Returns one page of the directory.
router.get('/', requireAuth, async (req, res) => {
    const { search = '', dept = '', status = '', order = 'asc' } = req.query;

    let sort = req.query.sort || 'empId';
    if (!SORTABLE_FIELDS.includes(sort)) sort = 'empId';
    if (sort === 'salary' && req.user.role !== 'admin') sort = 'empId'; // can't sort by a hidden column

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    // Build the MongoDB filter step by step (same ideas as in Extra.txt).
    const filter = {};
    if (search.trim()) {
        filter.empName = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }
    if (dept) {
        filter.dept = dept;
    }
    if (status === 'Active') {
        // Employees added before "status" existed have no status → count them as Active.
        filter.$or = [{ status: 'Active' }, { status: { $exists: false } }];
    } else if (status) {
        filter.status = status;
    }

    try {
        const [employees, total] = await Promise.all([
            hideSalaryFor(req,
                Emp.find(filter)
                    .collation({ locale: 'en' })        // case-insensitive sorting by name
                    .sort({ [sort]: order === 'desc' ? -1 : 1, empId: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
            ),
            Emp.countDocuments(filter)
        ]);

        return res.json({
            employees,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit))
        });
    } catch (err) {
        return sendError(res, err);
    }
});

// GET /emp/departments  → ["Engineering", "HR", ...]  (for the filter dropdown)
// Must come BEFORE "/:id", otherwise Express would treat "departments" as an id.
router.get('/departments', requireAuth, async (req, res) => {
    try {
        const departments = await Emp.distinct('dept');
        return res.json(departments.sort());
    } catch (err) {
        return sendError(res, err);
    }
});

// GET /emp/:id  → one employee (salary hidden for normal users)
router.get('/:id', requireAuth, async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid employee ID' });
    try {
        const emp = await hideSalaryFor(req, Emp.findOne({ empId: id }));
        if (!emp) return res.status(404).json({ error: 'Employee not found' });
        return res.json(emp);
    } catch (err) {
        return sendError(res, err);
    }
});

// POST /emp  → create (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    const data = { empId: req.body.empId };
    for (const field of EDITABLE_FIELDS) {
        if (!isEmpty(req.body[field])) data[field] = req.body[field];
    }
    try {
        const emp = await Emp.create(data);
        return res.status(201).json(emp);
    } catch (err) {
        return sendError(res, err);
    }
});

// PUT /emp/:id  → update any field except empId (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid employee ID' });

    // $set the fields that have a value, $unset optional fields that were cleared.
    const $set = {};
    const $unset = {};
    for (const field of EDITABLE_FIELDS) {
        if (!(field in req.body)) continue;          // not sent → leave as is
        if (isEmpty(req.body[field])) $unset[field] = '';
        else $set[field] = req.body[field];
    }

    const update = { $set };
    if (Object.keys($unset).length > 0) update.$unset = $unset;

    try {
        const emp = await Emp.findOneAndUpdate(
            { empId: id },
            update,
            { new: true, runValidators: true }       // run schema rules on updates too
        );
        if (!emp) return res.status(404).json({ error: 'Employee not found' });
        return res.json(emp);
    } catch (err) {
        return sendError(res, err);
    }
});

// DELETE /emp/:id  → delete and return the employee (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid employee ID' });
    try {
        const emp = await Emp.findOneAndDelete({ empId: id });
        if (!emp) return res.status(404).json({ error: 'Employee not found' });
        return res.json(emp);
    } catch (err) {
        return sendError(res, err);
    }
});

export default router;
