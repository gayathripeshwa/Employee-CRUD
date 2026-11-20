import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddEmp from './components/AddEmp';
import DeleteEmp from './components/DeleteEmp';
import api from './api';

// Replace the real API with fakes so tests don't need the backend.
jest.mock('./api', () => ({
    __esModule: true,
    default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
    errorMessage: (err, fallback) => err?.response?.data?.error || fallback
}));

const page = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

afterEach(() => jest.clearAllMocks());

test('Add: empty form shows an error on the page', async () => {
    page(<AddEmp />);
    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));
    expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
});

test('Add: server error is shown on the page', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'Employee with ID 1 already exists' } } });
    page(<AddEmp />);
    fireEvent.change(screen.getByPlaceholderText('Employee ID'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText('Employee Name'), { target: { value: 'Asha' } });
    fireEvent.change(screen.getByPlaceholderText('Designation'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByPlaceholderText('Department'), { target: { value: 'IT' } });
    fireEvent.change(document.querySelector('input[type="date"]'), { target: { value: '2024-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
});

test('Delete: asks for confirmation on the page, then deletes', async () => {
    const emp = { empId: 7, empName: 'Ravi', des: 'QA', dept: 'IT', join: '2024-02-02' };
    api.get.mockResolvedValue({ data: emp });
    api.delete.mockResolvedValue({ data: emp });

    page(<DeleteEmp />);
    fireEvent.change(screen.getByPlaceholderText(/employee id/i), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: /find employee/i }));

    // Step 1: details + confirm buttons appear, nothing deleted yet
    expect(await screen.findByText(/delete this employee\?/i)).toBeInTheDocument();
    expect(api.delete).not.toHaveBeenCalled();

    // Step 2: confirm
    fireEvent.click(screen.getByRole('button', { name: /yes, delete/i }));
    expect(await screen.findByText(/Ravi \(ID 7\) was deleted/i)).toBeInTheDocument();
    expect(api.delete).toHaveBeenCalledWith('/emp/7');
});

test('Delete: cancel does not delete', async () => {
    api.get.mockResolvedValue({ data: { empId: 7, empName: 'Ravi' } });
    page(<DeleteEmp />);
    fireEvent.change(screen.getByPlaceholderText(/employee id/i), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: /find employee/i }));
    fireEvent.click(await screen.findByRole('button', { name: /cancel/i }));
    expect(screen.queryByText(/delete this employee\?/i)).not.toBeInTheDocument();
    expect(api.delete).not.toHaveBeenCalled();
});
