import { render, screen } from '@testing-library/react';
import Home from '../../src/pages/Home';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('../../src/components/TreeMenu', () => ({
  __esModule: true,
  default: () => <div>Menu</div>,
}));
jest.mock('../../src/hooks/useIsMobile', () => ({ useIsMobile: () => false }));

describe('Home page', () => {
  it('renders TreeMenu and default text', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText(/Please select a node/i)).toBeInTheDocument();
  });
});
