import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { useAuth } from '../AuthContext';
import { DEPARTMENTS, STATUSES, formatDate, formatSalary } from '../constants';
import { useFlashMessage } from '../useFlashMessage';
import Message from './Message';
import StatusBadge from './StatusBadge';
import './EmployeeList.css';

const PAGE_SIZE = 10;

function EmployeeList() {
    const { user } = useAuth();
    const isAdmin = user.role === 'admin';
    const navigate = useNavigate();
    const [message, setMessage] = useFlashMessage();

    // ----- what the user has chosen -----
    const [searchText, setSearchText] = useState('');   // what's typed in the box
    const [search, setSearch] = useState('');           // what we actually search for
    const [dept, setDept] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('empId');
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(1);

    // ----- what came back from the server -----
    const [data, setData] = useState({ employees: [], total: 0, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState(DEPARTMENTS);

    // Departments for the filter: our fixed list + any older ones already in the database.
    useEffect(() => {
        api.get('/emp/departments')
            .then((res) => setDepartments([...new Set([...DEPARTMENTS, ...res.data])]))
            .catch(() => {}); // the fixed list is good enough if this fails
    }, []);

    // "Debounce" the search box: wait until the user stops typing for 300 ms,
    // instead of calling the server on every single key press.
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchText.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer); // typed again → cancel the old timer
    }, [searchText]);

    // Load the current page whenever any choice changes.
    useEffect(() => {
        let ignore = false; // protects against an older, slower response arriving last

        setLoading(true);
        api.get('/emp', { params: { search, dept, status, sort, order, page, limit: PAGE_SIZE } })
            .then((res) => {
                if (!ignore) setData(res.data);
            })
            .catch((err) => {
                if (!ignore) setMessage({ type: 'error', text: errorMessage(err, 'Could not load employees') });
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [search, dept, status, sort, order, page, setMessage]);

    // Click a column header: same column → flip the order, new column → sort A→Z.
    const sortBy = (field) => {
        if (sort === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(field);
            setOrder('asc');
        }
        setPage(1);
    };

    const arrow = (field) => (sort === field ? (order === 'asc' ? ' ▲' : ' ▼') : '');

    const hasFilters = searchText || dept || status;
    const clearFilters = () => {
        setSearchText('');
        setSearch('');
        setDept('');
        setStatus('');
        setPage(1);
    };

    const { employees, total, pages } = data;
    const first = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const last = Math.min(page * PAGE_SIZE, total);

    // One sortable column header
    const header = (field, label) => (
        <th>
            <button type="button" className="sort-btn" onClick={() => sortBy(field)}>
                {label}{arrow(field)}
            </button>
        </th>
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Employee Directory</h1>
                    <p className="muted">{total} {total === 1 ? 'employee' : 'employees'}</p>
                </div>
                {isAdmin && (
                    <Link to="/employees/new" className="btn btn-primary">+ Add Employee</Link>
                )}
            </div>

            <Message message={message} onClose={() => setMessage(null)} />

            {/* ----- Filters ----- */}
            <div className="filters">
                <input
                    type="search"
                    className="filter-search"
                    placeholder="Search by name…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    aria-label="Search by name"
                />

                <select value={dept} onChange={(e) => { setDept(e.target.value); setPage(1); }} aria-label="Department">
                    <option value="">All departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>

                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status">
                    <option value="">All statuses</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                {hasFilters && (
                    <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                        Clear filters
                    </button>
                )}
            </div>

            {/* ----- Table ----- */}
            <div className="table-card">
                <table className="emp-table">
                    <thead>
                        <tr>
                            {header('empId', 'ID')}
                            {header('empName', 'Name')}
                            <th>Designation</th>
                            {header('dept', 'Department')}
                            {header('join', 'Joined')}
                            {header('status', 'Status')}
                            {isAdmin && header('salary', 'Salary')}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr
                                key={emp.empId}
                                className="clickable-row"
                                onClick={() => navigate(`/employees/${emp.empId}`)}
                            >
                                <td>{emp.empId}</td>
                                <td>
                                    {/* A real link too, so it works with the keyboard */}
                                    <Link to={`/employees/${emp.empId}`} onClick={(e) => e.stopPropagation()}>
                                        {emp.empName}
                                    </Link>
                                </td>
                                <td>{emp.des}</td>
                                <td>{emp.dept}</td>
                                <td>{formatDate(emp.join)}</td>
                                <td><StatusBadge status={emp.status} /></td>
                                {isAdmin && <td>{formatSalary(emp.salary)}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {loading && employees.length === 0 && <p className="table-note">Loading…</p>}

                {!loading && employees.length === 0 && (
                    <div className="table-note">
                        <p><strong>No employees found.</strong></p>
                        {hasFilters ? (
                            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                                Clear filters
                            </button>
                        ) : (
                            isAdmin && <Link to="/employees/new" className="btn btn-primary">Add your first employee</Link>
                        )}
                    </div>
                )}
            </div>

            {/* ----- Pagination ----- */}
            {total > 0 && (
                <div className="pagination">
                    <span className="muted">Showing {first}–{last} of {total}</span>
                    <div className="pagination-buttons">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            ← Previous
                        </button>
                        <span>Page {page} of {pages}</span>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            disabled={page >= pages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeList;
