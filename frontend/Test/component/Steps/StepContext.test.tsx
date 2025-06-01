import { renderHook, act } from '@testing-library/react';
import { StepProvider, useStep } from '../../../src/components/Steps/StepContext';

describe('StepContext', () => {
  it('throws error when used outside StepProvider', () => {
    expect(() => renderHook(() => useStep())).toThrowError('useStep must be used within a StepProvider');
  });

  it('provides default context and step/formData management', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <StepProvider>{children}</StepProvider>;
    const { result } = renderHook(() => useStep(), { wrapper });
    // Default values
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isLastStep).toBe(false);
    // nextStep increments
    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(1);
    // prevStep decrements once
    act(() => result.current.prevStep());
    expect(result.current.currentStep).toBe(0);
    // prevStep should not go below 0
    act(() => result.current.prevStep());
    expect(result.current.currentStep).toBe(0);
    // setStep sets within bounds
    act(() => {
      result.current.setStep(3);
    });
    expect(result.current.currentStep).toBe(3);
    expect(result.current.isLastStep).toBe(true);
    // setFormData updates and merges
    act(() => {
      result.current.setFormData({ name: 'Jane' });
    });
    expect(result.current.formData).toEqual({ name: 'Jane' });
    act(() => {
      result.current.setFormData({ email: 'jane@example.com' });
    });
    expect(result.current.formData).toEqual({ name: 'Jane', email: 'jane@example.com' });
  });
});
