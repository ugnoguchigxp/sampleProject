import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StepInput from '../../src/pages/StepInput';

describe('StepInput Page', () => {
  it('renders StepInput page without errors', () => {
    const { container } = render(
      <MemoryRouter>
        <StepInput />
      </MemoryRouter>
    );
    expect(container.childElementCount).toBeGreaterThan(0);
  });
});
