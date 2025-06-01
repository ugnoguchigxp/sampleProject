import { useTranslation } from 'react-i18next';

type ConfirmationProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const Confirmation: React.FC<ConfirmationProps> = ({ message, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <p className="text-gray-800 text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            {t('yes', 'はい')}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            {t('no', 'いいえ')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
