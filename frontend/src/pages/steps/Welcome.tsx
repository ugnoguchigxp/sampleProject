import { MdAutoAwesome } from 'react-icons/md';
import { Steps } from '../../components/Steps/Steps';
import { StepNavigation } from '../../components/Steps/StepNavigation';

export function Welcome() {
  return (
    <div className="relative max-w-4xl mx-auto"> 
      <Steps>
        <div >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MdAutoAwesome className="w-12 h-12 text-blue-500" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome to Our App</h2>
                <p className="text-lg text-gray-600 mt-2">
                  Let's get you set up with your new account. This will only take a few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Steps>
      <StepNavigation />
    </div>
  );
}