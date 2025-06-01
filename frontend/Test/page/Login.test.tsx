import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../src/pages/bbs/Login';
import { MemoryRouter } from 'react-router-dom';
import { AuthProviderMock } from '../mocks/AuthProviderMock';

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
// Mock useAuth
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn() }),
}));
// Mock useMutation
jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: jest.fn(), status: 'success' }),
}));

describe('Login page', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <AuthProviderMock>
          <Login />
        </AuthProviderMock>
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error on empty submit', async () => {
    render(
      <MemoryRouter>
        <AuthProviderMock>
          <Login />
        </AuthProviderMock>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/Email is required|email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required|password is required/i)).toBeInTheDocument();
    });
  });

  // API/Mutationの成功・失敗パターンはMockで追加可能
});
