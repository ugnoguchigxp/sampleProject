import { useState, useEffect } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { Steps } from '../../components/Steps/Steps';
import { useStep } from '../../components/Steps/StepContext';
import { useTranslation } from 'react-i18next';

export function Welcome() {
  const [agreement, setAgreement] = useState<string>('');
  const { setFormData, formData } = useStep();
  const { t } = useTranslation();

  // agreementの状態をStepContextのformDataに保存
  useEffect(() => {
    setFormData({ agreement });
  }, [agreement, setFormData]);

  // 初期値をformData.agreementから復元
  useEffect(() => {
    if (formData.agreement && agreement !== formData.agreement) {
      setAgreement(formData.agreement);
    }
  }, [formData.agreement, agreement]);

  const terms = t('welcome.terms', `\n利用規約（サンプル）\n第1条（目的）\n本規約は、ユーザーが本サービスを利用する際の一切の行為に適用されます。\n第2条（禁止事項）\nユーザーは以下の行為を行ってはなりません。\n・法令または公序良俗に違反する行為\n・犯罪行為に関連する行為\n・その他運営者が不適切と判断する行為\n第3条（免責事項）\n本サービスの利用により生じた損害について、運営者は一切の責任を負いません。\n...（以下省略）...`);

  return (
    <div className="relative max-w-4xl mx-auto">
      <Steps>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <MdAutoAwesome className="w-12 h-12 text-blue-500" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{t('welcome.title', '利用規約への同意')}</h2>
                <p className="text-lg text-gray-600 mt-2">
                  {t('welcome.description', 'サービスをご利用いただく前に、以下の利用規約をお読みください。')}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded p-6 max-h-72 overflow-y-auto border border-gray-200 mb-6 whitespace-pre-wrap text-sm text-gray-800">
            {terms}
          </div>
          <div className="flex flex-col gap-2 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="agreement"
                value="agree"
                checked={agreement === 'agree'}
                onChange={() => setAgreement('agree')}
              />
              {t('agree', 'I agree')}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="agreement"
                value="disagree"
                checked={agreement === 'disagree'}
                onChange={() => setAgreement('disagree')}
              />
              {t('disagree', 'I do not agree')}
            </label>
          </div>
        </div>
      </Steps>
    </div>
  );
}