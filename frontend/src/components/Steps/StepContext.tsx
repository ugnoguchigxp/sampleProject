import { createContext, useContext, useState } from 'react';
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  preferences: z.object({
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark']),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface StepContextType {
  currentStep: number;
  formData: Partial<FormData>;
  setFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  isLastStep: boolean;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

export function StepProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  return (
    <StepContext.Provider
      value={{
        currentStep,
        formData,
        setFormData: (data) => setFormData((prev) => ({ ...prev, ...data })),
        nextStep,
        prevStep,
        setStep,
        isLastStep: currentStep === totalSteps - 1,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

export function useStep() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }
  return context;
}