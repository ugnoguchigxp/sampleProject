// Mock react-i18next and useIsMobile
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: 'en', changeLanguage: () => {} },
  }),
}));
jest.mock('../../src/hooks/useIsMobile', () => ({ useIsMobile: () => false }));

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TreeMenu from '../../src/components/TreeMenu';

describe('TreeMenu component', () => {
  it('renders control bar and menu title', () => {
    render(
      <MemoryRouter>
        <TreeMenu onSelect={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('全展開')).toBeInTheDocument();
    expect(screen.getByLabelText('全折りたたみ')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders top-level items and calls onSelect on link click', () => {
    const onSelect = jest.fn();
    render(
      <MemoryRouter>
        <TreeMenu onSelect={onSelect} />
      </MemoryRouter>
    );
    // Top-level items: bbs, stepInput, settings, notifications
    ['bbs', 'stepInput', 'settings', 'notifications'].forEach((id) => {
      const link = screen.getByText(id);
      expect(link).toBeInTheDocument();
      fireEvent.click(link);
      expect(onSelect).toHaveBeenCalledWith(id);
    });
  });

  it('expands and collapses children with controls', () => {
    render(
      <MemoryRouter>
        <TreeMenu onSelect={() => {}} />
      </MemoryRouter>
    );
    // Initially child not present
    expect(screen.queryByText('user')).toBeNull();
    // Use expandAll to show children
    fireEvent.click(screen.getByLabelText('全展開'));
    expect(screen.getByText('user')).toBeInTheDocument();
    // Collapse all
    fireEvent.click(screen.getByLabelText('全折りたたみ'));
    expect(screen.queryByText('user')).toBeNull();
  });
});
