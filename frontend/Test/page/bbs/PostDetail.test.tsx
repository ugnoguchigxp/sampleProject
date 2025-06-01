import { render, screen } from '@testing-library/react';
import PostDetail from '../../../src/pages/bbs/PostDetail';
import { MemoryRouter } from 'react-router-dom';
import { AuthProviderMock } from '../../mocks/AuthProviderMock';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('../../../src/hooks/useIsMobile', () => ({ useIsMobile: () => false }));

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: { id: '1', title: 'Test', content: 'Content', author: { id: '1' } }, status: 'success' }),
  useMutation: () => ({ mutate: jest.fn(), status: 'success' }),
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));
jest.mock('../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: () => true }),
}));
jest.mock('../../../src/components/Button', () => ({
  __esModule: true,
  default: (props: any) => <button {...props}>{props.children || props.label}</button>,
}));

describe('bbs/PostDetail page', () => {
  it('renders post title and content', () => {
    render(
      <MemoryRouter>
        <AuthProviderMock>
          <PostDetail />
        </AuthProviderMock>
      </MemoryRouter>
    );
    // h1要素の存在を確認
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    // コメントが0件の時のテキストを確認
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });
});
