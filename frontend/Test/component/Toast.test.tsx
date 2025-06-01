import { render, screen } from '@testing-library/react';
import Toast from '../../src/components/Toast';

/**
 * Tests for Toast component
 */
describe('Toast component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render message when visible is true', () => {
    // Arrange
    render(
      <Toast message="Test toast message" visible={true} onClose={() => {}} />
    );
    
    // Assert
    expect(screen.getByText('Test toast message')).toBeInTheDocument();
  });

  it('should display message correctly with visible=true', () => {
    // Arrange
    render(
      <Toast message="Test toast message" visible={true} onClose={() => {}} />
    );
    
    // Assert - just verify the message is displayed
    expect(screen.getByText('Test toast message')).toBeInTheDocument();
  });

  it('should auto close after 3 seconds', () => {
    // Arrange
    const handleClose = jest.fn();
    render(
      <Toast 
        message="Test toast message" 
        visible={true} 
        onClose={handleClose} 
      />
    );
    
    // Act - advance timer by 3 seconds (timeout) + 500ms (animation)
    jest.advanceTimersByTime(3000);
    expect(handleClose).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(500);
    
    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render the message with both visible states', () => {
    // Arrange
    const { rerender } = render(
      <Toast message="Test toast message" visible={false} onClose={() => {}} />
    );
    
    // Check if message is present but not visible
    expect(screen.getByText('Test toast message')).toBeInTheDocument();
    
    // Act
    rerender(
      <Toast message="Test toast message" visible={true} onClose={() => {}} />
    );
    
    // Assert - message is still present
    expect(screen.getByText('Test toast message')).toBeInTheDocument();
  });

  it('should have bg-opacity-80 class', () => {
    // Arrange
    render(
      <Toast message="Test toast message" visible={true} onClose={() => {}} />
    );
    
    // Assert - check for an actual class that is part of the component
    const toastDiv = screen.getByText('Test toast message').closest('div');
    expect(toastDiv).toHaveClass('bg-opacity-80');
  });
});
