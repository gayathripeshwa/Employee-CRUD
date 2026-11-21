import mongoose from 'mongoose';

export const STATUSES = ['Active', 'On leave', 'Exited'];

const empSchema = new mongoose.Schema(
    {
        // ---- Required (these existed before) ----
        empId: { type: Number, required: [true, 'Employee ID is required'], unique: true, min: [1, 'Employee ID must be 1 or more'] },
        empName: { type: String, required: [true, 'Name is required'], trim: true },
        // des = designation, dept = department
        des: { type: String, required: [true, 'Designation is required'], trim: true },
        dept: { type: String, required: [true, 'Department is required'], trim: true },
        join: { type: String, required: [true, 'Joining date is required'] }, // "YYYY-MM-DD"

        // ---- New, optional (so employees added before still work) ----
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
            unique: true,
            sparse: true   // "unique" only among employees that HAVE an email
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9+\-\s]{7,15}$/, 'Please enter a valid phone number']
        },
        salary: { type: Number, min: [0, 'Salary cannot be negative'] },
        status: {
            type: String,
            enum: { values: STATUSES, message: 'Status must be Active, On leave or Exited' },
            default: 'Active'
        }
    },
    { timestamps: true }   // adds createdAt and updatedAt automatically
);

// Model name stays "Emp" so your existing data (the "emps" collection) is kept.
const Emp = mongoose.model('Emp', empSchema);

export default Emp;
