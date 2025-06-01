import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../../../src/pages/bbs/Register';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn() }),
}));
jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: jest.fn(), status: 'success' }),
}));

describe('bbs/Register page', () => {
  it('renders register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('email', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText('password', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /createAccount/i })).toBeInTheDocument();
  });

  it('shows validation error on empty submit', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /createAccount/i }));
    await waitFor(() => {
      expect(screen.getByText('emailRequired')).toBeInTheDocument();
      expect(screen.getByText('passwordMinLength')).toBeInTheDocument();
    });
  });
});
