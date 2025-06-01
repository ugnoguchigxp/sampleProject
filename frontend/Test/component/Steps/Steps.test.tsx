import { render, screen } from '@testing-library/react';
import { Steps } from '../../../src/components/Steps/Steps';

describe('Steps component', () => {
  it('renders children inside motion container', () => {
    render(
      <Steps>
        <div data-testid="child">Step Content</div>
      </Steps>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Step Content');
  });
});
