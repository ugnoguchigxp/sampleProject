import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AttachmentForm } from '../components/attachment/attachment-form';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2, FiFile } from 'react-icons/fi';
import Toast from '../components/Toast';
import Confirmation from '../components/Confirmation';
import {
  UserAttachment,
  useUserAttachmentMutations,
  useUserAttachments,
} from '../services/user_attachments';
import { FileIcon } from '../components/FileIcon';

type FormMode = 'add' | 'edit' | null;

export function SampleAttachments() {
  const { t } = useTranslation();
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [selectedFile, setSelectedFile] = useState<UserAttachment | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { createMutation, updateMutation, deleteMutation } = useUserAttachmentMutations();

  const { userAttachments, isLoading } = useUserAttachments();

  useEffect(() => {
    const handleToastEvent = (event: CustomEvent<{ message: string }>) => {
      setToastMessage(event.detail.message);
      setShowToast(true);
    };

    window.addEventListener('show-toast' as any, handleToastEvent);

    return () => {
      window.removeEventListener('show-toast' as any, handleToastEvent);
    };
  }, []);

  const handleFormSubmit = (data: any) => {
    if (formMode === 'add') {
      createMutation.mutate(
        {
          attachments: data.files,
          title: data.title,
          note: data.note,
        },
        {
          onSuccess: () => {
            closeForm();
          },
        },
      );
    } else if (formMode === 'edit' && selectedFile?.id) {
      updateMutation.mutate(
        {
          id: selectedFile.id,
          title: data.title,
          note: data.note,
        },
        {
          onSuccess: () => {
            closeForm();
          },
        },
      );
    }
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedFile(null);
  };

  const handleEditClick = (attachment: any) => {
    setSelectedFile({
      id: attachment.id,
      title: attachment.title,
      note: attachment.note,
      mediaFileName: attachment.mediaFileName,
      mediaFileSize: attachment.mediaFileSize,
      mediaContentType: attachment.mediaContentType,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt || attachment.createdAt,
    });
    setFormMode('edit');
  };

  const handleDeleteClick = (attachment: any) => {
    setSelectedFile({
      id: attachment.id,
      title: attachment.title,
      note: attachment.note,
      mediaFileName: attachment.mediaFileName,
      mediaFileSize: attachment.mediaFileSize,
      mediaContentType: attachment.mediaContentType,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt || attachment.createdAt,
    });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (selectedFile?.id) {
      deleteMutation.mutate(selectedFile.id);
      setShowDeleteConfirmation(false);
      setSelectedFile(null);
    }
  };

  const renderTableRow = (attachment: any, index: number) => {
    const fileUrl = attachment.id || null;

    return (
      <tr key={attachment.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="py-3 px-4">{attachment.title || '-'}</td>
        <td className="py-3 px-4">
          <FileIcon
            url={fileUrl}
            type={attachment.mediaContentType || ''}
            name={attachment.mediaFileName}
            showFilename={true}
            className="hover:text-blue-600 transition-colors"
          />
        </td>
        <td className="py-3 px-4">
          {attachment.mediaFileSize ? `${(attachment.mediaFileSize / 1024).toFixed(2)} KB` : '-'}
        </td>
        <td className="py-3 px-4">{attachment.note || '-'}</td>
        <td className="py-3 px-4">{new Date(attachment.createdAt).toLocaleDateString()}</td>
        <td className="py-3 px-4">
          <div className="flex justify-center space-x-3">
            <Button
              icon={FiEdit2}
              onClick={() => handleEditClick(attachment)}
              className="p-1 text-yellow-500 hover:text-yellow-700 bg-transparent"
              label={<span className="sr-only">{t('edit', 'Edit')}</span>}
            />
            <Button
              icon={FiTrash2}
              onClick={() => handleDeleteClick(attachment)}
              className="p-1 text-red-500 hover:text-red-700 bg-transparent"
              label={<span className="sr-only">{t('delete', 'Delete')}</span>}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('attachments', 'Attachments')}</h1>
        <Button
          onClick={() => setFormMode('add')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <FiPlus className="mr-2" />
          {t('userAttachment.uploadFile', 'Upload file')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 font-semibold">{t('userAttachment.title', 'Title')}</th>
                <th className="py-3 px-4 font-semibold">
                  {t('userAttachment.fileName', 'File name')}
                </th>
                <th className="py-3 px-4 font-semibold">{t('userAttachment.size', 'Size')}</th>
                <th className="py-3 px-4 font-semibold">{t('userAttachment.note', 'Note')}</th>
                <th className="py-3 px-4 font-semibold">
                  {t('userAttachment.uploadDate', 'Upload date')}
                </th>
              </tr>
            </thead>
            <tbody>
              {userAttachments.length > 0 ? (
                userAttachments.map((attachment: any, index: number) =>
                  renderTableRow(attachment, index),
                )
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <FiFile className="mx-auto text-gray-400 text-5xl mb-3" />
                    <p className="text-gray-500">{t('noFilesUploaded', 'No files uploaded yet')}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {t('uploadPrompt', 'Click the "Upload File" button to add files')}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={formMode !== null} onClose={closeForm}>
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">
            {formMode === 'add'
              ? t('uploadNewFile', 'Upload New File')
              : t('editFileInfo', 'Edit File Information')}
          </h2>
          <AttachmentForm
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            initialValues={selectedFile || undefined}
            editMode={formMode === 'edit'}
          />
        </div>
      </Modal>

      {showDeleteConfirmation && (
        <Confirmation
          message={t('deleteFileConfirmation', 'Are you sure you want to delete this file?')}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}

      <Toast message={toastMessage} visible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default SampleAttachments;
