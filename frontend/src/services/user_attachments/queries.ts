import { useQuery } from '@tanstack/react-query';
import { fetchUserAttachments } from './fetchers';

export function useUserAttachments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user_attachments'],
    queryFn: fetchUserAttachments,
  });

  const userAttachments = data || [];

  return {
    userAttachments,
    isLoading,
    isError: !!error,
    error,
  };
}
