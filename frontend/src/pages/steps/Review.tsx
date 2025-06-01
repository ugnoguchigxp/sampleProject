import { Steps } from '../../components/Steps/Steps.tsx';
import { useStep } from '../../components/Steps/StepContext.tsx';
import { MdChecklist } from 'react-icons/md';

export function Review() {
  const { formData } = useStep();

  return (
    <Steps>
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <div className="flex items-center gap-4">
          <MdChecklist className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-semibold">Review Your Information</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Personal Information</h3>
            <dl className="mt-2 divide-y divide-gray-200">
              <div className="flex justify-between py-2">
                <dt className="text-gray-500">Name</dt>
                <dd className="text-gray-900">{formData.name}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900">{formData.email}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-gray-500">Phone</dt>
                <dd className="text-gray-900">{formData.phone}</dd>
              </div>
            </dl>
          </div>

        </div>
      </div>
    </Steps>
  );
}