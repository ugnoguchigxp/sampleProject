import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../../src/components/Tooltip';

describe('Tooltip component', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip text="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('renders tooltip text in the DOM', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip text="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    // tooltip text exists in DOM (CSS visibility not testable in jsdom)
    const tooltipEl = screen.getByText('Tooltip text', { exact: true });
    expect(tooltipEl).toBeInTheDocument();
    // simulate hover (CSS pseudo-class not applied in jsdom)
    await user.hover(screen.getByText('Hover me'));
    expect(tooltipEl).toHaveClass('opacity-0', { exact: false });
  });
});
