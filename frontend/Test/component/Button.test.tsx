import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Button from '../../src/components/Button';
import { FiPlus } from 'react-icons/fi';

/**
 * Tests for Button component
 */
describe('Button component', () => {
  it('should render with label', () => {
    // Arrange
    render(<Button label="Test Button" />);
    
    // Assert
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should render with children', () => {
    // Arrange
    render(<Button>Test Children</Button>);
    
    // Assert
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('should trigger onClick when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button label="Clickable" onClick={handleClick} />);
    
    // Act
    await user.click(screen.getByText('Clickable'));
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onClick when disabled', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button label="Disabled" onClick={handleClick} disabled />);
    
    // Act
    await user.click(screen.getByText('Disabled'));
    
    // Assert
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render as a link when "to" prop is provided', () => {
    // Arrange
    render(
      <MemoryRouter>
        <Button label="Link Button" to="/some-path" />
      </MemoryRouter>
    );
    
    // Assert
    const linkElement = screen.getByText('Link Button');
    expect(linkElement.closest('a')).toHaveAttribute('href', '/some-path');
  });

  it('should render with an icon', () => {
    // Arrange
    render(<Button label="With Icon" icon={FiPlus} />);
    
    // Assert
    // The icon is rendered as an SVG
    expect(screen.getByText('With Icon').parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('should apply primary styles by default', () => {
    // Arrange
    render(<Button label="Primary Button" />);
    
    // Assert
    const button = screen.getByText('Primary Button');
    expect(button.closest('button')).toHaveClass('bg-primary');
  });

  it('should apply danger styles when className contains error', () => {
    // Arrange
    render(<Button label="Danger Button" className="error" />);
    
    // Assert
    const button = screen.getByText('Danger Button');
    expect(button.closest('button')).toHaveClass('bg-danger');
  });

  it('should apply secondary styles when className contains secondary', () => {
    // Arrange
    render(<Button label="Secondary Button" className="secondary" />);
    
    // Assert
    const button = screen.getByText('Secondary Button');
    expect(button.closest('button')).toHaveClass('bg-secondary');
  });
});
