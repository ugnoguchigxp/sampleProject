import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Steps } from '../../components/Steps/Steps.tsx';
import { MdPerson } from 'react-icons/md';
import { useStep } from '../../components/Steps/StepContext.tsx';
import { personalInfoSchema, PersonalInfoForm } from '../../schemas/personalInfo.schema';

/**
 * PersonalInfo step: collects user's name, email, and phone with validation.
 */
export function PersonalInfo() {
  const { formData, setFormData } = useStep();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
    },
    mode: 'onChange',
  });

  // Sync form state to step context on change
  const onSubmit = (data: PersonalInfoForm) => {
    setFormData(data);
    // 次のステップへの遷移は親コンポーネントで制御
  };

  useEffect(() => {
    setFormData({
      name: watch('name'),
      email: watch('email'),
      phone: watch('phone'),
    });
  }, [watch('name'), watch('email'), watch('phone'), setFormData]);

  return (
    <Steps>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto py-6">
        <div className="flex items-center gap-4">
          <MdPerson className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-semibold">{t('personalInfo', 'Personal Information')}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t('fullName', 'Full Name')} <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email', 'Email Address')} <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              {t('phone', 'Phone Number')} <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>
        </div>
      </form>
    </Steps>
  );
}