import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export type AssetBehavior = 'new_tab' | 'download';

export type FetchAssetFunction = (url: string) => Promise<Blob>;

export interface OpenAssetParams {
  url: string | null;
  behavior?: AssetBehavior;
  filename?: string;
  fetchFunction?: FetchAssetFunction;
}

export function extractUrlFilename(url: string | null): string {
  if (!url) return 'unknown';

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    return decodeURIComponent(lastPart || '') || 'unknown';
  } catch (e) {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'unknown';
  }
}

function isAttachmentIdUrl(url: string): boolean {
  return /^[a-zA-Z0-9-]{8,36}$/.test(url);
}

// function isApiDownloadUrl(url: string): boolean {
//   return url.startsWith('/api/user_attachments/') && url.includes('/download');
// }

// function getIdFromApiUrl(url: string): string {
//   const match = url.match(/\/api\/user_attachments\/([^\/]+)\/download/);
//   return match ? match[1] : '';
// }

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export async function fetchAttachmentById(id: string): Promise<Blob> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
  const downloadUrl = `${API_URL}/api/user_attachments/${id}/download`;

  console.log('Fetching attachment from URL:', downloadUrl);

  const response = await axios({
    url: downloadUrl,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });

  return response.data;
}

export function useOpenAuthenticatedAsset() {
  const { t } = useTranslation();

  const openAsset = useCallback(
    async ({ url, behavior = 'download', filename, fetchFunction }: OpenAssetParams) => {
      if (!url) {
        console.error('Asset URL is null or undefined');
        const event = new CustomEvent('show-toast', {
          detail: { message: t('fileNotFound', 'file not found') },
        });
        window.dispatchEvent(event);
        return;
      }

      try {
        let blob: Blob;

        if (url.startsWith('http')) {
          if (behavior === 'new_tab') {
            window.open(url, '_blank');
            return;
          }

          const token = getAuthToken();
          const headers: Record<string, string> = {};

          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(url, { headers });
          blob = await response.blob();
        } else if (url.startsWith('/api/user_attachments/') && url.includes('/download')) {
          const match = url.match(/\/api\/user_attachments\/([^\/]+)\/download/);
          const id = match ? match[1] : '';

          if (!id) {
            throw new Error('Invalid user attachment URL format');
          }

          blob = await fetchAttachmentById(id);
        } else if (isAttachmentIdUrl(url)) {
          blob = await fetchAttachmentById(url);
        } else if (fetchFunction) {
          blob = await fetchFunction(url);
        } else {
          try {
            console.log('Trying to fetch attachment with URL as ID:', url);
            const token = getAuthToken();
            const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
            const downloadUrl = `${API_URL}/api/user_attachments/${url}/download`;

            const response = await axios({
              url: downloadUrl,
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: 'blob',
            });

            blob = response.data;
          } catch (err) {
            console.error('Failed to fetch attachment:', err);
            throw new Error('Unable to fetch asset. Invalid URL or missing fetchFunction.');
          }
        }

        if (behavior === 'new_tab') {
          const blobUrl = window.URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 30000);
        } else {
          handleDownload(blob, filename || extractUrlFilename(url));
        }
      } catch (error) {
        console.error('Error opening asset:', error);
        const event = new CustomEvent('show-toast', {
          detail: { message: t('fileOpenError', 'can not open file') },
        });
        window.dispatchEvent(event);
      }
    },
    [t],
  );

  const handleDownload = (data: Blob, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  return [openAsset] as const;
}
