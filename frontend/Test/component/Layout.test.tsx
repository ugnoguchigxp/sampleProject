// JestでTextEncoder未定義エラー対策
import { TextEncoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

// react-i18next の useTranslation をモック
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string) => defaultValue,
    i18n: {
      language: 'en',
      changeLanguage: () => {},
    },
  }),
}));
// LanguageSelectorをスタブ化してi18n.language undefinedエラーを回避
jest.mock('../../src/components/LanguageSelector', () => ({
  default: () => null,
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContext from '../../src/contexts/AuthContext';
import Layout from '../../src/components/Layout';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('Layout component', () => {
  it('should render logo link and login/register when not authenticated', () => {
    // Arrange: useAuthを未認証としてモック
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      logout: jest.fn(),
      isAuthenticated: () => false,
      login: jest.fn(),
      token: null,
      decodedToken: null,
    });

    // Act
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    // Assert: ロゴリンクとLogin/Registerアイコンが表示される
    const homeLink = screen.getByRole('link', { name: /Sample Project/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(screen.getByLabelText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Register')).toBeInTheDocument();
  });

  it('should open user menu and call logout when authenticated', () => {
    const mockLogout = jest.fn();
    // Arrange: useAuthを認証済みとしてモック
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: '1', username: 'testuser', email: 'a@b.com' },
      logout: mockLogout,
      isAuthenticated: () => true,
      login: jest.fn(),
      token: 'token',
      decodedToken: null,
    });

    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    // Act: ユーザーメニューボタンをクリック
    const menuButton = screen.getByRole('button', { name: 'User menu' });
    fireEvent.click(menuButton);

    // Assert: Logoutボタンが表示され、クリックでlogoutが呼ばれる
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
