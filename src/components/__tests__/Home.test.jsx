import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../Home';
import { AuthProvider } from '../../AuthContext';

vi.mock('../../AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({ isLoggedIn: false, username: '' }),
}));

describe('Home Component', () => {
  it('shows welcome message for logged out users', () => {
    render(<Home />);
    expect(screen.getByText(/please log in or register/i)).toBeInTheDocument();
  });
});