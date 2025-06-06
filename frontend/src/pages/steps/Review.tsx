import { Steps } from '../../components/Steps/Steps.tsx';
import { useStep } from '../../components/Steps/StepContext.tsx';
import { MdChecklist } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

function renderValue(value: any) {
  const { t } = useTranslation();
  if (typeof value === 'boolean') return value ? t('yes') : t('no');
  if (value === undefined || value === null || value === '') return <span className="text-gray-400">未入力</span>;
  return String(value);
}

// キーごとにtのnamespaceやfallbackを工夫
function getLabel(t: any, key: string) {
  // preferences系はネスト対応
  if (['favoriteColor','feedback','satisfaction','improvement','fruit','notifications'].includes(key)) {
    return t(`preferences.${key}`, t(key));
  }
  // reviewタイトルなど
  if (['reviewTitle','allFormData'].includes(key)) {
    return t(`review.${key}`, t(key));
  }
  // 通常
  return t(key);
}

export function Review() {
  const { formData } = useStep();
  const { t } = useTranslation();

  const mainEntries = Object.entries(formData).filter(
    ([key]) => key !== 'preferences'
  );
  const preferencesEntries = formData.preferences && typeof formData.preferences === 'object'
    ? Object.entries(formData.preferences)
    : [];

  return (
    <Steps>
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <div className="flex items-center gap-4">
          <MdChecklist className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-semibold">{getLabel(t, 'confirmScreen')}</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">{getLabel(t, 'allFormData')}</h3>
            <dl className="mt-2 divide-y divide-gray-200">
              {mainEntries.map(([key, value]) => (
                <div className="flex justify-between py-2" key={key}>
                  <dt className="text-gray-500">{getLabel(t, key)}</dt>
                  <dd className="text-gray-900">{renderValue(value)}</dd>
                </div>
              ))}
            </dl>
            {preferencesEntries.length > 0 && (
              <div className="mt-4">
                <div className="font-bold text-blue-700 mb-2">{t('Preferences')}</div>
                <dl className="divide-y divide-gray-200">
                  {preferencesEntries.map(([pKey, pValue]) => (
                    <div className="flex justify-between py-2" key={pKey}>
                      <dt className="text-gray-500">{getLabel(t, pKey)}</dt>
                      <dd className="text-gray-900">{renderValue(pValue)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
        <div className='text-center'> よろしければ完了ボタンを押してください。</div>
        <div className='h-40' />
      </div>
    </Steps>
  );
}