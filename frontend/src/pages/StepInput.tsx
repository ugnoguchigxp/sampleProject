import { StepProvider ,useStep } from '../components/Steps/StepContext';
import { Steps } from '../components/Steps/Steps';
import { StepNavigation } from '../components/Steps/StepNavigation';
import { Welcome } from './steps/Welcome';
import { PersonalInfo } from './steps/PersonalInfo';
import { Preferences } from './steps/Preferences';
import { Review } from './steps/Review';

function WizardContent() {
  const { currentStep } = useStep();
  const steps = [
    <Welcome key="welcome" />, 
    <PersonalInfo key="personal" />, 
    <Preferences key="preferences" />, 
    <Review key="review" />
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {steps[currentStep]}
    </div>
  );
}

const StepInput: React.FC = () => (
  <StepProvider>
    <Steps>
      <WizardContent />
    </Steps>
    <StepNavigation />
  </StepProvider>
);

export default StepInput;
