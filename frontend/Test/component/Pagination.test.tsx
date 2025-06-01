import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Pagination from '../../src/components/Pagination';

/**
 * Tests for Pagination component
 */
describe('Pagination component', () => {
  it('should render current page and total pages information', () => {
    // Arrange
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        totalPosts={100} 
        onPageChange={() => {}} 
      />
    );
    
    // Assert
    expect(screen.getByText('3 / 10 (100)')).toBeInTheDocument();
  });

  it('should disable first and previous buttons on first page', () => {
    // Arrange
    render(
      <Pagination 
        currentPage={1} 
        totalPages={10} 
        totalPosts={100} 
        onPageChange={() => {}} 
      />
    );
    
    // Assert
    const firstPageButton = screen.getByTitle('First Page');
    const prevPageButton = screen.getByTitle('Previous Page');
    
    expect(firstPageButton).toBeDisabled();
    expect(prevPageButton).toBeDisabled();
  });

  it('should disable next and last buttons on last page', () => {
    // Arrange
    render(
      <Pagination 
        currentPage={10} 
        totalPages={10} 
        totalPosts={100} 
        onPageChange={() => {}} 
      />
    );
    
    // Assert
    const nextPageButton = screen.getByTitle('Next Page');
    const lastPageButton = screen.getByTitle('Last Page');
    
    expect(nextPageButton).toBeDisabled();
    expect(lastPageButton).toBeDisabled();
  });

  it('should call onPageChange with 1 when first page button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={5} 
        totalPages={10} 
        totalPosts={100} 
        onPageChange={handlePageChange} 
      />
    );
    
    // Act
    await user.click(screen.getByTitle('First Page'));
    
    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageChange with currentPage - 1 when previous button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={5} 
        totalPages={10} 
        totalPosts={100} 
        onPageChange={handlePageChange} 
      />
    );
    
    // Act
    await user.click(screen.getByTitle('Previous Page'));
    
    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('should call onPageChange with currentPage + 1 when next button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={5} 
        totalPages={10} 
        totalPosts={100} 
        onPageChange={handlePageChange} 
      />
    );
    
    // Act
    await user.click(screen.getByTitle('Next Page'));
    
    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(6);
  });

  it('should call onPageChange with totalPages when last page button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={5} 
        totalPages={10} 
        totalPosts={100} 
        onPageChange={handlePageChange} 
      />
    );
    
    // Act
    await user.click(screen.getByTitle('Last Page'));
    
    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(10);
  });

  it('should handle zero total pages gracefully', () => {
    // Arrange
    render(
      <Pagination 
        currentPage={1} 
        totalPages={0} 
        totalPosts={0} 
        onPageChange={() => {}} 
      />
    );
    
    // Assert
    expect(screen.getByText('1 / 1 (0)')).toBeInTheDocument();
    
    const nextPageButton = screen.getByTitle('Next Page');
    const lastPageButton = screen.getByTitle('Last Page');
    
    expect(nextPageButton).toBeDisabled();
    expect(lastPageButton).toBeDisabled();
  });
});
