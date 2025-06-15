import { Routes, Route, Navigate } from 'react-router-dom';
// BBS Components
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/bbs/Login';
import Register from './pages/bbs/Register';
import PostDetail from './pages/bbs/PostDetail';
import List from './pages/bbs/List';
import StepInput from './pages/StepInput';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NotFound from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Routes>
      {/* Layoutを使わないルート */}
      <Route path="/step-input" element={
        <ProtectedRoute>
          <StepInput />
        </ProtectedRoute>
      } />
      {/* Layoutを使うルート */}
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 認証が必要なルート */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/bbs/list" element={<ProtectedRoute><List /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </AuthProvider>
  );
};

export default App;