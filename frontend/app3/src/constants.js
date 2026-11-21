// Fixed choices for the dropdowns, so "IT", "it" and "I.T." don't become
// three different departments.
export const DEPARTMENTS = [
    'Engineering',
    'IT',
    'HR',
    'Finance',
    'Sales',
    'Marketing',
    'Operations',
    'Support'
];

// Must match STATUSES in backend/models/Emp.js
export const STATUSES = ['Active', 'On leave', 'Exited'];

// ₹50,000 style formatting for salaries.
export function formatSalary(value) {
    if (value === undefined || value === null || value === '') return '—';
    return '₹' + Number(value).toLocaleString('en-IN');
}

// "2024-01-10" → "10 Jan 2024"
export function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
