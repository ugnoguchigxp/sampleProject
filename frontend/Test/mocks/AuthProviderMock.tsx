import { ReactNode } from 'react';

// AuthContextのモック実装
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com', username: 'testuser' },
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    isAuthenticated: () => true,
  }),
}));

// テスト用のAuthProviderラッパー
export const AuthProviderMock = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
