import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFile, FiImage, FiFileText } from 'react-icons/fi';
import { extractUrlFilename, useOpenAuthenticatedAsset } from '../hooks/useOpenAuthenticatedAsset';

interface FileIconProps {
  url: string | null;
  type: string;
  name?: string;
  title?: string;
  showFilename?: boolean;
  className?: string;
  iconSize?: number;
}

export function FileIcon({
  url,
  type,
  name,
  title,
  showFilename = false,
  className = '',
  iconSize = 20,
}: FileIconProps) {
  const { t } = useTranslation();
  const [openAsset] = useOpenAuthenticatedAsset();

  let icon: ReactNode = <FiFile size={iconSize} />;

  if (type.indexOf('image') > -1) {
    icon = <FiImage size={iconSize} />;
  }

  if (type.indexOf('pdf') > -1) {
    icon = <FiFileText size={iconSize} />;
  }

  const filename = name || extractUrlFilename(url);

  return (
    <span
      className={`file-icon ${className}`}
      onClick={(event) => {
        event.stopPropagation();
        if (url) {
          console.log('FileIcon click - URL:', url, 'Type:', type, 'Filename:', name || filename);
          const behavior =
            type.startsWith('image') || type.includes('pdf') ? 'new_tab' : 'download';
          openAsset({
            url,
            behavior,
            filename: name || filename,
          });
        }
      }}
      title={title || filename}
      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
    >
      {icon}
      {showFilename && (
        <span className="ml-2">
          {url ? (
            <span
              className="text-blue-500 hover:text-blue-700 hover:underline"
              style={{ marginLeft: '4px' }}
            >
              {filename}
            </span>
          ) : (
            <span className="text-gray-500">{t('fileNotFound', 'File not found')}</span>
          )}
        </span>
      )}
    </span>
  );
}
