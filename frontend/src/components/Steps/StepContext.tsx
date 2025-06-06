import { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  preferences: z.object({
    notifications: z.boolean(),
    fruit: z.enum(['apple', 'banana', 'orange', 'grape', 'melon', 'other'], { required_error: '好きな果物を選択してください' }),
    favoriteColor: z.string().min(1, 'Favorite color is required'),
    feedback: z.string().min(10, 'Please provide at least 10 characters'),
    satisfaction: z.enum(['very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied']),
    improvement: z.string().optional(),
  }),
  agreement: z.string().optional(),
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
  const [formData, setFormDataState] = useState<Partial<FormData>>({});

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

  // useCallbackでラップし、参照が変わらないようにする
  const setFormData = useCallback(
    (data: Partial<FormData>) => {
      setFormDataState((prev) => ({ ...prev, ...data }));
    },
    []
  );

  return (
    <StepContext.Provider
      value={{
        currentStep,
        formData,
        setFormData,
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