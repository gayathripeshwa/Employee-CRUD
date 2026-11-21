import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import App from './App';
import api from './api';

// Fake API so the pages can load without a backend.
jest.mock('./api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
  errorMessage: (err, fallback) => err?.response?.data?.error || fallback
}));

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

beforeEach(() => {
  api.get.mockImplementation((url) =>
    Promise.resolve({
      data: url === '/emp/departments' ? [] : { employees: [], total: 0, page: 1, pages: 1 }
    })
  );
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('logged-out users are sent to the login page', () => {
  renderAt('/');
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});

test('the home page is the directory, with a navigation bar', async () => {
  loginAs('admin');
  renderAt('/');
  expect(await screen.findByRole('heading', { name: /employee directory/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^directory$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});

test('admins see "Add Employee" in the navbar, normal users do not', async () => {
  loginAs('admin');
  const { unmount } = renderAt('/employees');
  expect(await screen.findByRole('link', { name: /^add employee$/i })).toBeInTheDocument();
  unmount();
  localStorage.clear();

  loginAs('user');
  renderAt('/employees');
  await screen.findByRole('heading', { name: /employee directory/i });
  expect(screen.queryByRole('link', { name: /add employee/i })).not.toBeInTheDocument();
});

test('normal users cannot open admin pages by typing the URL', async () => {
  loginAs('user');
  renderAt('/employees/new');
  expect(await screen.findByRole('heading', { name: /employee directory/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /^add employee$/i })).not.toBeInTheDocument();
});

test('old addresses like /search go to the directory', async () => {
  loginAs('user');
  renderAt('/search');
  expect(await screen.findByRole('heading', { name: /employee directory/i })).toBeInTheDocument();
});
