import { MultipleContainers } from '../components/dnd';
import { useTranslation } from 'react-i18next';

export function DragDrop() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('sampleDragDrop')}</h1>

      <MultipleContainers />
    </div>
  );
}
