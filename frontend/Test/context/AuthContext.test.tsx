import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';

// jwt-decode をモック
jest.mock('jwt-decode', () => ({
  jwtDecode: (_token: string) => ({
    email: 'test@example.com',
    username: 'testuser',
    userId: '1',
    exp: Math.floor(Date.now() / 1000) + 3600,
  }),
}));

// localStorage をクリア
beforeEach(() => {
  localStorage.clear();
});

describe('AuthContext', () => {
  it('throws error when useAuth is used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
  });

  it('login sets token, user, decodedToken and isAuthenticated returns true', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('dummyToken', { id: '1', email: 'test@example.com', username: 'testuser' });
    });

    expect(localStorage.getItem('token')).toBe('dummyToken');
    expect(result.current.token).toBe('dummyToken');
    expect(result.current.user).toEqual({ id: '1', email: 'test@example.com', username: 'testuser' });
    expect(result.current.decodedToken).toMatchObject({ email: 'test@example.com', username: 'testuser', userId: '1' });
    expect(result.current.isAuthenticated()).toBe(true);
  });

  it('logout clears token, user, decodedToken and isAuthenticated returns false', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('dummy', { id: '1', email: 'a@b.c', username: 'u' });
    });
    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.decodedToken).toBeNull();
    expect(result.current.isAuthenticated()).toBe(false);
  });
});
