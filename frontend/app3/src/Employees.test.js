import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import EmployeeList from './components/EmployeeList';
import EmployeeProfile from './components/EmployeeProfile';
import AddEmp from './components/AddEmp';
import EditEmp from './components/EditEmp';
import api from './api';

jest.mock('./api', () => ({
    __esModule: true,
    default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
    errorMessage: (err, fallback) => err?.response?.data?.error || fallback
}));

const ravi = {
    empId: 7, empName: 'Ravi', des: 'QA Engineer', dept: 'IT', join: '2024-02-02',
    email: 'ravi@x.com', phone: '98765 43210', salary: 50000, status: 'On leave'
};
const asha = { empId: 1, empName: 'Asha', des: 'Developer', dept: 'Engineering', join: '2023-05-01' };

function loginAs(role) {
    localStorage.setItem('token', 't');
    localStorage.setItem('user', JSON.stringify({ name: 'Test', role }));
}

// Render a few real routes so navigation between pages can be checked.
function renderAt(path) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <AuthProvider>
                <Routes>
                    <Route path="/employees" element={<EmployeeList />} />
                    <Route path="/employees/new" element={<AddEmp />} />
                    <Route path="/employees/:id" element={<EmployeeProfile />} />
                    <Route path="/employees/:id/edit" element={<EditEmp />} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

function mockDirectory(employees) {
    api.get.mockImplementation((url) => {
        if (url === '/emp/departments') return Promise.resolve({ data: ['Engineering', 'IT'] });
        if (url === '/emp') return Promise.resolve({ data: { employees, total: employees.length, page: 1, pages: 1 } });
        if (url === '/emp/7') return Promise.resolve({ data: ravi });
        return Promise.reject({ response: { data: { error: 'Employee not found' } } });
    });
}

afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

// ---------------- Directory ----------------

test('directory lists employees and shows salary only to admins', async () => {
    loginAs('admin');
    mockDirectory([asha, ravi]);
    const { unmount } = renderAt('/employees');
    expect(await screen.findByRole('link', { name: 'Ravi' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Asha' })).toBeInTheDocument();
    expect(screen.getByText('₹50,000')).toBeInTheDocument();
    const table = within(screen.getByRole('table'));
    expect(table.getByText('On leave')).toBeInTheDocument();
    expect(table.getByText('Active')).toBeInTheDocument(); // old record with no status
    unmount();

    localStorage.clear();
    loginAs('user');
    renderAt('/employees');
    await screen.findByRole('link', { name: 'Ravi' });
    expect(screen.queryByText('₹50,000')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /salary/i })).not.toBeInTheDocument();
});

test('typing in search, filtering and sorting ask the server for the right page', async () => {
    loginAs('admin');
    mockDirectory([ravi]);
    renderAt('/employees');
    await screen.findByRole('link', { name: 'Ravi' });

    const lastParams = () => api.get.mock.calls.filter(([url]) => url === '/emp').at(-1)[1].params;

    fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'rav' } });
    await waitFor(() => expect(lastParams().search).toBe('rav'));   // after the 300 ms debounce

    fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'IT' } });
    await waitFor(() => expect(lastParams()).toMatchObject({ search: 'rav', dept: 'IT', page: 1 }));

    fireEvent.click(screen.getByRole('button', { name: /^name/i }));
    await waitFor(() => expect(lastParams()).toMatchObject({ sort: 'empName', order: 'asc' }));
    fireEvent.click(screen.getByRole('button', { name: /^name/i }));
    await waitFor(() => expect(lastParams()).toMatchObject({ sort: 'empName', order: 'desc' }));
});

test('empty directory with filters offers to clear them', async () => {
    loginAs('user');
    mockDirectory([]);
    renderAt('/employees');
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Exited' } });
    expect(await screen.findByText(/no employees found/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /clear filters/i }).length).toBeGreaterThan(0);
});

// ---------------- Profile ----------------

test('profile shows all details; admin can delete after confirming on the page', async () => {
    loginAs('admin');
    mockDirectory([]);
    api.delete.mockResolvedValue({ data: ravi });
    renderAt('/employees/7');

    expect(await screen.findByRole('heading', { name: 'Ravi' })).toBeInTheDocument();
    expect(screen.getByText('ravi@x.com')).toBeInTheDocument();
    expect(screen.getByText('₹50,000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /edit/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(screen.getByText(/this cannot be undone/i)).toBeInTheDocument();
    expect(api.delete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /yes, delete/i }));
    // lands on the directory with the message waiting
    expect(await screen.findByText(/Ravi \(ID 7\) was deleted/i)).toBeInTheDocument();
    expect(api.delete).toHaveBeenCalledWith('/emp/7');
});

test('normal users see the profile without salary, edit or delete', async () => {
    loginAs('user');
    mockDirectory([]);
    api.get.mockImplementation((url) =>
        url === '/emp/7' ? Promise.resolve({ data: { ...ravi, salary: undefined } }) : Promise.resolve({ data: [] })
    );
    renderAt('/employees/7');
    expect(await screen.findByRole('heading', { name: 'Ravi' })).toBeInTheDocument();
    expect(screen.queryByText(/salary/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
});

test('unknown employee shows an error', async () => {
    loginAs('admin');
    mockDirectory([]);
    renderAt('/employees/999');
    expect(await screen.findByText(/employee not found/i)).toBeInTheDocument();
});

// ---------------- Add / Edit form ----------------

test('add form shows an error under each empty required field', async () => {
    loginAs('admin');
    renderAt('/employees/new');
    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));
    expect(await screen.findByText('Employee ID is required')).toBeInTheDocument();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Please choose a department')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
});

test('add form checks email and phone format', async () => {
    loginAs('admin');
    renderAt('/employees/new');
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));
    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument();
    expect(screen.getByText(/use 7–15 digits/i)).toBeInTheDocument();
});

test('adding an employee sends numbers and goes to their profile', async () => {
    loginAs('admin');
    mockDirectory([]);
    api.post.mockResolvedValue({ data: ravi });
    renderAt('/employees/new');

    fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ravi' } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: 'QA Engineer' } });
    fireEvent.change(screen.getByLabelText(/^department/i), { target: { value: 'IT' } });
    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: '2024-02-02' } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: '50000' } });
    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    expect(await screen.findByText(/Ravi was added/i)).toBeInTheDocument();
    expect(api.post).toHaveBeenCalledWith('/emp', expect.objectContaining({
        empId: 7, empName: 'Ravi', dept: 'IT', salary: 50000, status: 'Active'
    }));
});

test('server errors (like a duplicate ID) appear in the form', async () => {
    loginAs('admin');
    api.post.mockRejectedValue({ response: { data: { error: 'An employee with this ID already exists' } } });
    renderAt('/employees/new');
    fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByLabelText(/^department/i), { target: { value: 'IT' } });
    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: '2024-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
});

test('edit form is pre-filled, keeps the ID locked, and saves every field', async () => {
    loginAs('admin');
    mockDirectory([]);
    api.put.mockResolvedValue({ data: { ...ravi, des: 'QA Lead' } });
    renderAt('/employees/7/edit');

    const name = await screen.findByLabelText(/full name/i);
    expect(name).toHaveValue('Ravi');
    expect(screen.getByLabelText(/employee id/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toHaveValue('ravi@x.com');
    expect(screen.getByLabelText(/^status/i)).toHaveValue('On leave');

    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: 'QA Lead' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(/Ravi's details were updated/i)).toBeInTheDocument();
    const [url, body] = api.put.mock.calls[0];
    expect(url).toBe('/emp/7');
    expect(body).toMatchObject({ des: 'QA Lead', email: 'ravi@x.com', salary: 50000 });
    expect(body).not.toHaveProperty('empId');
});
