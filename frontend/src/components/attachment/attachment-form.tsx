import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Attachment } from './attachment';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { FiSave, FiX } from 'react-icons/fi';

type FormValues = {
  title?: string;
  note?: string;
  files: File[] | any[];
};

interface AttachmentFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialValues?: {
    title?: string;
    note?: string;
    fileId?: string;
  };
  editMode?: boolean;
}

export function AttachmentForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialValues,
  editMode = false,
}: AttachmentFormProps) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialValues?.title || '',
      note: initialValues?.note || '',
      files: [],
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    if (!editMode && files.length === 0) {
      setFileError(t('file_validation_min_required', 'At least one file must be uploaded'));
      return;
    }

    setFileError(null);

    if (editMode) {
      onSubmit({
        ...data,
        files: [],
      });
    } else {
      onSubmit({
        ...data,
        files,
      });
    }
  };

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setFileError(null);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          {t('title', 'Title')} ({t('optional', 'Optional')})
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('enterTitle', 'Enter title')}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      {!editMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('attachment', 'Attachment')} *
          </label>
          <Attachment
            contentType="attachment"
            onFilesAccepted={handleFilesAccepted}
            isUploading={isSubmitting}
          />
          {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
        </div>
      )}

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          {t('note', 'Note')} ({t('optional', 'Optional')})
        </label>
        <textarea
          id="note"
          {...register('note')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('enterNote', 'Enter note')}
        />
        {errors.note && <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          onClick={onCancel}
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiX className="mr-2" />
          {t('cancel', 'Cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <FiSave className="mr-2" />
          {isSubmitting
            ? t('submitting', 'Submitting...')
            : editMode
              ? t('update', 'Update')
              : t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
