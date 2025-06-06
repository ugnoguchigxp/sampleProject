import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ContentType, createFileValidator } from '../form/validations';
import './styles.css';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiX } from 'react-icons/fi';

interface AttachmentProps {
  contentType: ContentType;
  onFilesAccepted: (files: File[]) => void;
  multiple?: boolean;
  onUploadSuccess?: (response: any) => void;
  onCancel?: () => void;
  isUploading?: boolean;
}

export function Attachment({
  contentType,
  onFilesAccepted,
  multiple = false,
  onCancel,
  isUploading = false,
}: AttachmentProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const validateFiles = (files: File[]) => {
        if (!multiple) {
          const validator = createFileValidator(contentType, false, t);
          return validator(files[0]);
        }

        const validator = createFileValidator(contentType, true, t);
        return validator(files);
      };

      const validationError = validateFiles(acceptedFiles);

      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      const filesToUse = multiple ? acceptedFiles : [acceptedFiles[0]];

      setSelectedFiles(filesToUse as File[]);
      onFilesAccepted(filesToUse as File[]);
    },
    [contentType, onFilesAccepted, multiple],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    noClick: selectedFiles.length > 0 && !multiple,
  });

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFilesAccepted(newFiles);
  };

  return (
    <div className="attachment-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
      >
        <input {...getInputProps()} />

        {selectedFiles.length > 0 ? (
          <div className="selected-files">
            {selectedFiles.map((file, index) => (
              <div key={index} className="selected-file">
                <span>{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                {!isUploading && (
                  <button
                    type="button"
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="upload-message">
            {isDragActive ? (
              <p>{t('dropFilesHere', 'Drop files here...')}</p>
            ) : (
              <>
                <div className="upload-icon">
                  <FiUpload size={28} />
                </div>
                <p>{t('dragAndDropFiles', 'Drag & drop files here, or click to select')}</p>
                <Button className="browse-button">{t('selectFiles', 'Select Files')}</Button>
              </>
            )}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {onCancel && (
        <div className="attachment-actions">
          <Button onClick={onCancel} className="cancel-button">
            {t('cancel', 'Cancel')}
          </Button>
        </div>
      )}
    </div>
  );
}
