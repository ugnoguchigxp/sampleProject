import { render, screen } from '@testing-library/react';
import { Preferences } from '../../../src/pages/steps/Preferences';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: () => ({}),
    handleSubmit: (fn: any) => fn,
    formState: { errors: {} },
    watch: () => 'light',
  }),
}));
jest.mock('../../../src/components/Steps/Steps', () => ({
  Steps: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('../../../src/components/Steps/StepContext', () => ({
  useStep: () => ({
    currentStep: 0,
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    isLastStep: false,
    setStep: jest.fn(),
    formData: { preferences: { notifications: false, theme: 'light' } },
    setFormData: jest.fn(),
  }),
}));

describe('Preferences page', () => {
  it('renders preferences form', () => {
    render(<Preferences />);
    expect(screen.getByText(/preferences/i)).toBeInTheDocument();
  });
});
