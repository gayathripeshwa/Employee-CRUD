import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { errorMessage } from '../api';
import { DEPARTMENTS, STATUSES } from '../constants';
import Message from './Message';
import './EmployeeForm.css';

const EMPTY_EMPLOYEE = {
    empId: '',
    empName: '',
    email: '',
    phone: '',
    des: '',
    dept: '',
    join: '',
    salary: '',
    status: 'Active'
};

// One form used by BOTH "Add Employee" and "Edit Employee", so they can't drift apart.
//
// Props:
//   defaultValues  – the employee to pre-fill (Edit) or nothing (Add)
//   isEdit         – true on the Edit page (Employee ID can't be changed)
//   onSubmit(data) – async function that saves; if it throws, the error is shown here
//   submitLabel    – text on the save button
//   cancelTo       – where "Cancel" goes
function EmployeeForm({ defaultValues, isEdit = false, onSubmit, submitLabel, cancelTo }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({ defaultValues: { ...EMPTY_EMPLOYEE, ...defaultValues } });

    const [message, setMessage] = useState(null);

    // Old employees might have a department that isn't in the list (e.g. "it").
    // Keep it as an option so editing them doesn't silently change it.
    const currentDept = defaultValues?.dept;
    const departments =
        currentDept && !DEPARTMENTS.includes(currentDept) ? [currentDept, ...DEPARTMENTS] : DEPARTMENTS;

    const submit = async (data) => {
        setMessage(null);

        // Tidy up before sending: numbers as numbers, empty salary stays empty.
        const cleaned = {
            ...data,
            salary: data.salary === '' ? '' : Number(data.salary)
        };
        if (isEdit) {
            delete cleaned.empId; // the ID comes from the URL and never changes
        } else {
            cleaned.empId = Number(data.empId);
        }

        try {
            await onSubmit(cleaned);
        } catch (err) {
            setMessage({ type: 'error', text: errorMessage(err, 'Could not save employee') });
        }
    };

    // Small helper so every field shows its own error underneath.
    const fieldError = (name) =>
        errors[name] && <span className="field-error">{errors[name].message}</span>;

    return (
        <form className="employee-form" onSubmit={handleSubmit(submit)} noValidate>

            <h3 className="form-section">Job details</h3>

            <div className="form-grid">
                <label className="field">
                    <span>Employee ID *</span>
                    <input
                        type="number"
                        disabled={isEdit}
                        aria-invalid={!!errors.empId}
                        {...register('empId', {
                            required: 'Employee ID is required',
                            min: { value: 1, message: 'Employee ID must be 1 or more' }
                        })}
                    />
                    {isEdit && <span className="field-hint">The ID can't be changed.</span>}
                    {fieldError('empId')}
                </label>

                <label className="field">
                    <span>Full name *</span>
                    <input
                        aria-invalid={!!errors.empName}
                        {...register('empName', { required: 'Name is required' })}
                    />
                    {fieldError('empName')}
                </label>

                <label className="field">
                    <span>Designation *</span>
                    <input
                        aria-invalid={!!errors.des}
                        {...register('des', { required: 'Designation is required' })}
                    />
                    {fieldError('des')}
                </label>

                <label className="field">
                    <span>Department *</span>
                    <select
                        aria-invalid={!!errors.dept}
                        {...register('dept', { required: 'Please choose a department' })}
                    >
                        <option value="">Select department</option>
                        {departments.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    {fieldError('dept')}
                </label>

                <label className="field">
                    <span>Joining date *</span>
                    <input
                        type="date"
                        aria-invalid={!!errors.join}
                        {...register('join', { required: 'Joining date is required' })}
                    />
                    {fieldError('join')}
                </label>

                <label className="field">
                    <span>Status</span>
                    <select
                        aria-invalid={!!errors.status}
                        {...register('status')}
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>

                <label className="field">
                    <span>Salary (₹ per year)</span>
                    <input
                        type="number"
                        aria-invalid={!!errors.salary}
                        {...register('salary', {
                            min: { value: 0, message: 'Salary cannot be negative' }
                        })}
                    />
                    <span className="field-hint">Only admins can see this.</span>
                    {fieldError('salary')}
                </label>
            </div>

            <h3 className="form-section">Contact</h3>

            <div className="form-grid">
                <label className="field">
                    <span>Email</span>
                    <input
                        type="email"
                        aria-invalid={!!errors.email}
                        {...register('email', {
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email' }
                        })}
                    />
                    {fieldError('email')}
                </label>

                <label className="field">
                    <span>Phone</span>
                    <input
                        type="tel"
                        aria-invalid={!!errors.phone}
                        {...register('phone', {
                            pattern: {
                                value: /^[0-9+\-\s]{7,15}$/,
                                message: 'Use 7–15 digits (spaces, + and - are fine)'
                            }
                        })}
                    />
                    {fieldError('phone')}
                </label>
            </div>

            <Message message={message} onClose={() => setMessage(null)} />

            <div className="form-actions">
                <Link to={cancelTo} className="btn btn-secondary">
                    Cancel
                </Link>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default EmployeeForm;
