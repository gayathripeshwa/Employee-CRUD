import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the home page with all four actions', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Employee Management System/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Employee/i)).toBeInTheDocument();
  expect(screen.getByText(/Search Employee/i)).toBeInTheDocument();
  expect(screen.getByText(/Update Employee/i)).toBeInTheDocument();
  expect(screen.getByText(/Delete Employee/i)).toBeInTheDocument();
});
