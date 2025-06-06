import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Selector from '../../src/components/Selector';

describe('Selector component', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];

  it('renders button label (buttonLabel指定あり)', () => {
    render(<Selector options={options} onSelect={() => {}} buttonLabel="Select" />);
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
  });

  it('renders default button label (buttonLabel未指定)', () => {
    render(<Selector options={options} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: '選択してください' })).toBeInTheDocument();
  });

  it('opens and displays options when clicked', async () => {
    const user = userEvent.setup();
    render(<Selector options={options} onSelect={() => {}} buttonLabel="Select" />);
    await user.click(screen.getByRole('button', { name: 'Select' }));
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('calls onSelect and closes after selecting an option', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<Selector options={options} onSelect={onSelect} buttonLabel="Select" />);
    await user.click(screen.getByRole('button', { name: 'Select' }));
    await user.click(screen.getByText('Option B'));
    expect(onSelect).toHaveBeenCalledWith('b');
    expect(screen.queryByText('Option A')).toBeNull();
  });

  it('highlights selectedValue option', async () => {
    const user = userEvent.setup();
    render(<Selector options={options} onSelect={() => {}} selectedValue="a" buttonLabel="Select" />);
    await user.click(screen.getByRole('button', { name: 'Select' }));
    expect(screen.getByText('Option A')).toHaveClass('font-bold');
  });

  it('renders button label (buttonLabel propで指定)', () => {
    render(<Selector options={options} onSelect={() => {}} buttonLabel="Choose an option" />);
    expect(screen.getByRole('button', { name: 'Choose an option' })).toBeInTheDocument();
  });

  it('renders selected option label when buttonLabel is not provided', () => {
    render(<Selector options={options} onSelect={() => {}} selectedValue="a" />);
    expect(screen.getByRole('button', { name: 'Option A' })).toBeInTheDocument();
  });
});
