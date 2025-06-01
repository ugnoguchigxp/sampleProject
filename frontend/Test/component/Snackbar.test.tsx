import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Snackbar } from '../../src/components/Snackbar';

/**
 * Tests for Snackbar component
 */
describe('Snackbar component', () => {
  it('should not render when isOpen is false', () => {
    // Arrange
    const { container } = render(
      <Snackbar isOpen={false} message="Test message" />
    );
    
    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it('should render with message when isOpen is true', () => {
    // Arrange
    render(
      <Snackbar isOpen={true} message="Test message" />
    );
    
    // Assert
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display default title for info type', () => {
    // Arrange
    render(
      <Snackbar isOpen={true} message="Test message" type="info" />
    );
    
    // Assert
    expect(screen.getByText('お知らせ')).toBeInTheDocument();
  });
    
  it('should display default title for success type', () => {
    // Arrange
    render(
      <Snackbar isOpen={true} message="Test message" type="success" />
    );
    
    // Assert
    expect(screen.getByText('成功')).toBeInTheDocument();
  });

  it('should use custom title when provided', () => {
    // Arrange
    render(
      <Snackbar isOpen={true} message="Test message" title="カスタムタイトル" />
    );
    
    // Assert
    expect(screen.getByText('カスタムタイトル')).toBeInTheDocument();
  });

  it('should apply correct style based on type', () => {
    // Arrange
    render(
      <Snackbar isOpen={true} message="Test message" type="success" />
    );
    
    // Assert
    const snackbarElement = screen.getByText('成功').parentElement?.parentElement;
    expect(snackbarElement).toHaveClass('bg-green-50');
    expect(snackbarElement).toHaveClass('border-green-500');
  });

  it('should call onClose when close button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(
      <Snackbar isOpen={true} message="Test message" onClose={handleClose} />
    );
    
    // Act
    await user.click(screen.getByText('×'));
    
    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should auto close after duration', () => {
    jest.useFakeTimers();
    
    // Arrange
    const handleClose = jest.fn();
    render(
      <Snackbar 
        isOpen={true} 
        message="Test message" 
        onClose={handleClose}
        duration={1000}
      />
    );
    
    // Act
    jest.advanceTimersByTime(1000);
    
    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });
});
