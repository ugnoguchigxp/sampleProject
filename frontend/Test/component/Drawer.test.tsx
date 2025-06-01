import { render, fireEvent } from '@testing-library/react';
import Drawer from '../../src/components/Drawer';

describe('Drawer component', () => {
  it('does not render overlay when closed', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Drawer isOpen={false} onClose={onClose}>
        <div data-testid="child" />
      </Drawer>
    );
    expect(container.querySelector('.bg-opacity-50')).toBeNull();
    const drawer = container.querySelector('#drawer');
    expect(drawer).toHaveClass('translate-x-full');
    expect(drawer).toHaveClass('right-0');
  });

  it('renders overlay and children when open and calls onClose on overlay click', () => {
    const onClose = jest.fn();
    const { container, getByTestId } = render(
      <Drawer isOpen={true} onClose={onClose}>
        <div data-testid="child">Content</div>
      </Drawer>
    );
    const overlay = container.querySelector('.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
    overlay && fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
    expect(getByTestId('child')).toHaveTextContent('Content');
    const drawer = container.querySelector('#drawer');
    expect(drawer).toHaveClass('translate-x-0');
    expect(drawer).toHaveClass('right-0');
  });

  it('applies left position when position="left"', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Drawer isOpen={false} onClose={onClose} position="left">
        <div />
      </Drawer>
    );
    const drawer = container.querySelector('#drawer');
    expect(drawer).toHaveClass('-translate-x-full');
    expect(drawer).toHaveClass('left-0');
  });
});
