import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Steps } from '../../components/Steps/Steps';
import { useStep } from '../../components/Steps/StepContext';
import { MdSettings } from 'react-icons/md';

// Preferences schema for validation
const preferencesSchema = z.object({
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark']),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

/**
 * Preferences step: collects user's notification and theme preferences with validation.
 */
export function Preferences() {
  const { formData, setFormData } = useStep();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: formData.preferences?.notifications ?? false,
      theme: formData.preferences?.theme ?? 'light',
    },
  });

  const onSubmit = (data: PreferencesForm) => {
    setFormData({ preferences: data });
    // 次のステップへの遷移は親コンポーネントで制御
  };

  return (
    <Steps>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto py-6">
        <div className="flex items-center gap-4">
          <MdSettings className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-semibold">Your Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notifications"
              {...register('notifications')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
              Enable notifications
            </label>
            {errors.notifications && <p className="mt-1 text-sm text-red-600">{errors.notifications.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Theme Preference</label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="light"
                  value="light"
                  {...register('theme')}
                  checked={watch('theme') === 'light'}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="light" className="text-sm text-gray-700">
                  Light Mode
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="dark"
                  value="dark"
                  {...register('theme')}
                  checked={watch('theme') === 'dark'}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="dark" className="text-sm text-gray-700">
                  Dark Mode
                </label>
              </div>
              {errors.theme && <p className="mt-1 text-sm text-red-600">{errors.theme.message}</p>}
            </div>
          </div>
        </div>
        <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md">
          Next
        </button>
      </form>
    </Steps>
  );
}