import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types/bbs';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  decodedToken: {
    email: string;
    username: string;
    userId: string;  // バックエンドからは文字列として渡されるため
  } | null;
}

interface JWTPayload {
  email: string;
  username: string;
  userId: string;  // バックエンドからは文字列として渡されるため
  exp: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<JWTPayload | null>(null);

  // トークンの有効性をチェックする関数
  const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  // トークンを検証し、デコードする関数
  const restoreAuthState = () => {
    const storedToken = localStorage.getItem('token');
    if (isValidToken(storedToken)) {
      const decoded = jwtDecode<JWTPayload>(storedToken!);
      setToken(storedToken);
      setDecodedToken(decoded);
      // JWTから最小限のユーザー情報を復元
      setUser({
        id: decoded.userId,  // すでに文字列なので変換不要
        email: decoded.email,
        username: decoded.username
      });
      return true;
    }
    return false;
  };

  const isAuthenticated = (): boolean => {
    if (isValidToken(token)) {
      return true;
    }
    // トークンが無効な場合、localStorageから再確認して状態を復元
    return restoreAuthState();
  };

  const login = (newToken: string, user: User) => {
    console.log('ログイン処理を開始します:', { user });
    localStorage.setItem('token', newToken);
    console.log('トークンをlocalStorageに保存しました');
    setToken(newToken);
    setUser(user);
    
    try {
      const decoded = jwtDecode<JWTPayload>(newToken);
      console.log('トークンのデコードに成功:', { 
        email: decoded.email,
        username: decoded.username,
        userId: decoded.userId,
        expires: new Date(decoded.exp * 1000).toLocaleString() 
      });
      setDecodedToken(decoded);
    } catch (error) {
      console.error('トークンのデコードに失敗:', error);
      // エラー発生時でもログインは続行
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setDecodedToken(null);
  };

  // 初期化時に認証状態を復元
  useEffect(() => {
    restoreAuthState();
  }, []);

  // トークンの有効期限をチェック
  useEffect(() => {
    if (token && !isValidToken(token)) {
      logout();
    }
  }, [token]);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    decodedToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
