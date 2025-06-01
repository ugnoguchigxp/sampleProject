import { render, screen } from '@testing-library/react';
import List from '../../../src/pages/bbs/List';
import { MemoryRouter } from 'react-router-dom';
import * as ReactQuery from '@tanstack/react-query';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('../../../src/hooks/useIsMobile', () => ({ useIsMobile: () => false }));
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: { posts: [], total: 0 }, status: 'success' }),
}));
jest.mock('../../../src/components/Button', () => ({
  __esModule: true,
  default: (props: any) => <button {...props}>{props.children || props['aria-label'] || props.label}</button>,
}));
jest.mock('../../../src/components/Pagination', () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      Pagination
      <button aria-label="next" onClick={() => props.onPageChange(props.currentPage + 1)}>Next</button>
    </div>
  ),
}));
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => ({ setIsModalOpen: jest.fn(), setNewPostButton: jest.fn() }),
  };
});

describe('bbs/List page', () => {
  it('renders create post button and no pagination when no posts', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );
    expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });

  it('renders pagination when posts exist', () => {
    const spy = jest.spyOn(ReactQuery, 'useQuery').mockImplementation(() => ({
      data: { posts: [{ id: '1', title: 'Test', content: 'Content', author: { id: '1', username: 'user1' }, category: { id: 'cat1', name: 'Category 1' }, createdAt: new Date().toISOString() }], total: 11 },
      status: 'success',
      isLoading: false,
      isError: false,
      isSuccess: true,
      isPending: false,
      error: null,
      refetch: jest.fn(),
      failureCount: 0,
      isFetched: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      remove: jest.fn(),
      fetchStatus: 'idle',
      errorUpdateCount: 0,
      isFetchedAfterMount: true,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      failureReason: null,
      isInitialLoading: false,
      isPaused: false,
      promise: Promise.resolve(),
    }));
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    spy.mockRestore();
  });
});
