import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createUserAttachments, updateUserAttachment, deleteUserAttachment } from './fetchers';
import { CreateUserAttachmentParams, UpdateUserAttachmentParams } from './types';

export function useUserAttachmentMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createMutation = useMutation({
    mutationFn: (data: CreateUserAttachmentParams) => {
      return createUserAttachments(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_attachments'] });
      showToastMessage(t('userAttachmentCreateSuccess', 'User attachment created successfully'));
    },
    onError: () => {
      showToastMessage(t('userAttachmentCreateError', 'User attachment creation failed'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserAttachmentParams) => {
      return updateUserAttachment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_attachments'] });
      showToastMessage(t('userAttachmentUpdateSuccess', 'User attachment updated successfully'));
    },
    onError: () => {
      showToastMessage(t('userAttachmentUpdateFailed', 'User attachment update failed'));
    },
  });

  /**
   * 删除附件的mutation
   */
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) => {
      return deleteUserAttachment(attachmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_attachments'] });
      showToastMessage(t('userAttachmentDeleteSuccess', 'User attachment deleted successfully'));
    },
    onError: () => {
      showToastMessage(t('userAttachmentDeleteError', 'User attachment delete failed'));
    },
  });

  const showToastMessage = (message: string) => {
    const event = new CustomEvent('show-toast', { detail: { message } });
    window.dispatchEvent(event);
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
