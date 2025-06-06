import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Steps } from '../../components/Steps/Steps';
import { useStep } from '../../components/Steps/StepContext';
import { MdSettings } from 'react-icons/md';
import { preferencesSchema, PreferencesForm } from '../../schemas/preferences.schema';
import { useTranslation } from 'react-i18next';

/**
 * Preferences step: collects user's preferences as a survey.
 */
export function Preferences() {
  const { formData, setFormData } = useStep();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: formData.preferences?.notifications ?? false,
      fruit: formData.preferences?.fruit ?? undefined,
      favoriteColor: formData.preferences?.favoriteColor ?? '',
      feedback: formData.preferences?.feedback ?? '',
      satisfaction: formData.preferences?.satisfaction ?? 'neutral',
      improvement: formData.preferences?.improvement ?? '',
    },
    mode: 'onChange',
  });

  // Sync form state to step context on change
  useEffect(() => {
    setFormData({
      preferences: {
        notifications: watch('notifications'),
        fruit: watch('fruit'),
        favoriteColor: watch('favoriteColor'),
        feedback: watch('feedback'),
        satisfaction: watch('satisfaction'),
        improvement: watch('improvement'),
      },
    });
  }, [watch('notifications'), watch('fruit'), watch('favoriteColor'), watch('feedback'), watch('satisfaction'), watch('improvement'), setFormData]);

  const onSubmit = (data: PreferencesForm) => {
    setFormData({ preferences: data });
    // 次のステップへの遷移は親コンポーネントで制御
  };

  return (
    <Steps>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto py-6">
        <div className="flex items-center gap-4">
          <MdSettings className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-semibold">{t('Preferences', 'アンケート')}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">
              {t('preferences.notifications', 'お知らせを受け取りますか？')}
            </label>
            <input
              type="checkbox"
              id="notifications"
              {...register('notifications')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {errors.notifications && <p className="mt-1 text-sm text-red-600">{errors.notifications.message}</p>}
          </div>
          <div>
            <label htmlFor="fruit" className="block text-sm font-medium text-gray-700">
              {t('preferences.fruit', '好きな果物')}
            </label>
            <select
              id="fruit"
              {...register('fruit')}
              className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 text-sm"
            >
              <option value="">{t('preferences.fruitSelect', '選択してください')}</option>
              <option value="apple">{t('apple', 'りんご')}</option>
              <option value="banana">{t('banana', 'バナナ')}</option>
              <option value="orange">{t('orange', 'オレンジ')}</option>
              <option value="grape">{t('grape', 'ぶどう')}</option>
              <option value="melon">{t('melon', 'メロン')}</option>
              <option value="other">{t('other', 'その他')}</option>
            </select>
            {errors.fruit && <p className="mt-1 text-sm text-red-600">{errors.fruit.message}</p>}
          </div>
          <div>
            <label htmlFor="favoriteColor" className="block text-sm font-medium text-gray-700">
              {t('preferences.favoriteColor', '好きな色')}
            </label>
            <input
              {...register('favoriteColor')}
              type="text"
              id="favoriteColor"
              className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 text-sm"
              placeholder={t('preferences.favoriteColorPlaceholder', '例: 青、赤、緑...')}
            />
            {errors.favoriteColor && <p className="mt-1 text-sm text-red-600">{errors.favoriteColor.message}</p>}
          </div>
          <div>
            <label htmlFor="satisfaction" className="block text-sm font-medium text-gray-700">
              {t('preferences.satisfaction', 'サービスの満足度')}
            </label>
            <select
              id="satisfaction"
              {...register('satisfaction')}
              className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 text-sm"
            >
              <option value="very_satisfied">{t('preferences.verySatisfied', 'とても満足')}</option>
              <option value="satisfied">{t('preferences.satisfied', '満足')}</option>
              <option value="neutral">{t('preferences.neutral', '普通')}</option>
              <option value="dissatisfied">{t('preferences.dissatisfied', 'やや不満')}</option>
              <option value="very_dissatisfied">{t('preferences.veryDissatisfied', '不満')}</option>
            </select>
            {errors.satisfaction && <p className="mt-1 text-sm text-red-600">{errors.satisfaction.message}</p>}
          </div>
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
              {t('preferences.feedback', 'ご意見・ご感想')}
            </label>
            <textarea
              {...register('feedback')}
              id="feedback"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 text-sm"
              placeholder={t('preferences.feedbackPlaceholder', 'ご自由にご記入ください')}
            />
            {errors.feedback && <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>}
          </div>
          <div>
            <label htmlFor="improvement" className="block text-sm font-medium text-gray-700">
              {t('preferences.improvement', '改善してほしい点（任意）')}
            </label>
            <input
              {...register('improvement')}
              type="text"
              id="improvement"
              className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 text-sm"
              placeholder={t('preferences.improvementPlaceholder', 'もっとこうしてほしい、など')}
            />
            {errors.improvement && <p className="mt-1 text-sm text-red-600">{errors.improvement.message}</p>}
          </div>
        </div>
        <div className='h-40'></div>
      </form>
    </Steps>
  );
}