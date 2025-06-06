// モック設定
import { render, screen, fireEvent } from '@testing-library/react';
import { StepNavigation } from '../../../src/components/Steps/StepNavigation';

// translationモック
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (_key: string, defaultValue: string) => defaultValue }) }));

// navigationモック
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

// useStepモック
let currentStep = 0;
let isLastStep = false;
const mockPrevStep = jest.fn();
const mockNextStep = jest.fn();
const mockSetStep = jest.fn();
const defaultFormData = {
  agreement: 'agree',
  name: 'Taro',
  email: 'taro@example.com',
  phone: '09012345678',
  preferences: {
    notifications: true,
    fruit: 'apple',
    favoriteColor: 'blue',
    feedback: 'This is a feedback message.',
    satisfaction: 'satisfied',
    improvement: 'More features',
  },
};
let formData = { ...defaultFormData };
jest.mock('../../../src/components/Steps/StepContext.tsx', () => ({
  useStep: () => ({ currentStep, prevStep: mockPrevStep, nextStep: mockNextStep, isLastStep, setStep: mockSetStep, formData }),
}));

beforeEach(() => {
  mockPrevStep.mockClear();
  mockNextStep.mockClear();
  mockNavigate.mockClear();
  formData = { ...defaultFormData };
});

describe('StepNavigation component', () => {
  it('Back button is disabled when currentStep=0', () => {
    currentStep = 0;
    isLastStep = false;
    render(<StepNavigation />);
    const backBtn = screen.getByRole('button', { name: /Back/i });
    expect(backBtn).toBeDisabled();
  });

  it('calls prevStep when Back button is clicked', () => {
    currentStep = 2;
    isLastStep = false;
    render(<StepNavigation />);
    const backBtn = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backBtn);
    expect(mockPrevStep).toHaveBeenCalled();
  });

  it('calls nextStep when Next button is clicked', () => {
    currentStep = 1;
    isLastStep = false;
    render(<StepNavigation />);
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    expect(mockNextStep).toHaveBeenCalled();
  });

  it('calls navigate when Complete button is clicked', () => {
    currentStep = 3;
    isLastStep = true;
    render(<StepNavigation />);
    const completeBtn = screen.getByRole('button', { name: /Complete/i });
    fireEvent.click(completeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
