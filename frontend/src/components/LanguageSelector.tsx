import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
import Selector from './Selector';

interface LanguageSelectorProps {
  className?: string;
  id?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className, id }) => {
  const { i18n } = useTranslation();

  const options = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
    { value: 'cn', label: '中文' },
    { value: 'kr', label: '한국어' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'pt', label: 'Português' },
    { value: 'es', label: 'Español' },
    { value: 'nl', label: 'Nederlands' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguageLabel = options.find(option => option.value === i18n.language)?.label || 'Language';

  return (
    <div className={className}>
      <Selector
        id={id}
        options={options}
        onSelect={changeLanguage}
        selectedValue={i18n.language}
        buttonLabel={
          <>
            <FiGlobe className="text-lg" />
            {currentLanguageLabel}
          </>
        }
      />
    </div>
  );
};

export default LanguageSelector;
