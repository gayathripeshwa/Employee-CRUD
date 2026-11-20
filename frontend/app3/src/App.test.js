import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import App from './App';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

function loginAs(role) {
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('user', JSON.stringify({ name: 'Test', email: 't@t.com', role }));
}

afterEach(() => localStorage.clear());

test('logged-out users are sent to the login page', () => {
  renderAt('/');
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});

test('admins see all four actions', () => {
  loginAs('admin');
  renderAt('/');
  expect(screen.getByText(/Add Employee/i)).toBeInTheDocument();
  expect(screen.getByText(/Search Employee/i)).toBeInTheDocument();
  expect(screen.getByText(/Update Employee/i)).toBeInTheDocument();
  expect(screen.getByText(/Delete Employee/i)).toBeInTheDocument();
});

test('normal users only see Search', () => {
  loginAs('user');
  renderAt('/');
  expect(screen.getByText(/Search Employee/i)).toBeInTheDocument();
  expect(screen.queryByText(/Add Employee/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete Employee/i)).not.toBeInTheDocument();
});

test('normal users cannot open admin pages by typing the URL', () => {
  loginAs('user');
  renderAt('/delete');
  expect(screen.getByText(/Search Employee/i)).toBeInTheDocument(); // redirected home
  expect(screen.queryByRole('heading', { name: /Delete Employee/i })).not.toBeInTheDocument();
});
