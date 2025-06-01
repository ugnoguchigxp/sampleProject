import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../src/components/Modal';

/**
 * Tests for Modal component
 */
describe('Modal component', () => {
  it('should not render when isOpen is false', () => {
    // Arrange
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it('should render content when isOpen is true', () => {
    // Arrange
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Assert
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', async () => {
    // Arrange
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Act
    await userEvent.click(screen.getByTestId('modal-backdrop'));
    
    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is clicked', async () => {
    // Arrange
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Act
    await userEvent.click(screen.getByLabelText('Close modal'));
    
    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
