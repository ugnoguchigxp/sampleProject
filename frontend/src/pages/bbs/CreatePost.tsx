import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi, categoriesApi } from '../../services/bbs/api';
import type { Category } from '../../types/bbs';
import { FiSend, FiX } from 'react-icons/fi';
import Toast from '../../components/Toast';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import Confirmation from '../../components/Confirmation';
import './CreatePost.css'; // 新しいCSSファイルをインポート
import Button from '../../components/Button';

interface CreatePostForm {
  title: string;
  content: string;
  categoryId: string;
}

type CreatePostProps = {
  onClose: () => void;
};

// Add a comment to indicate that CreatePost is designed to be used exclusively within a modal.
const CreatePost: React.FC<CreatePostProps> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreatePostForm>();
  const { t } = useTranslation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories().then(res => res.data),
  });

  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // 投稿一覧を再取得
      setToastMsg(t('postCreated', 'post created successfully'));
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 3500);
    },
    onError: (error: any) => {
      console.error('Failed to create post:', error.response?.data?.error || error.message);
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createPostMutation.mutateAsync(data);
      reset(); // フォームをリセット
      onClose(); // モーダルを閉じる
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmCancel = () => {
    console.log('User confirmed cancel, resetting form and closing modal.'); // Debug log
    reset(); // フォームをリセット
    setIsConfirmVisible(false);
    handleCloseWithAnimation(); // アニメーション付きで閉じる
  };

  const cancelConfirmation = () => {
    console.log('User canceled confirmation, hiding confirmation modal.'); // Debug log
    setIsConfirmVisible(false);
  };

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // アニメーションの時間に合わせる
  };

  return (
    <div id="bbs-create-post-page" className={`modal ${isMobile ? (isClosing ? 'slide-down' : '') : 'relative'}`}>
      <div className="modal-content">
        <div className={`max-w-2xl mx-auto px-4 py-6 ${isMobile ? 'px-2 py-3' : ''}`}>
          <div className="mb-8">
            <h1 className={`text-3xl font-bold text-gray-900 ${isMobile ? 'text-xl' : ''}`}>{t('createNewPost', 'Create New Post')}</h1>
            <p className={`mt-2 text-gray-600 ${isMobile ? 'text-sm' : ''}`}>{t('shareThoughts', 'Share your thoughts with the community')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                {t('title', 'Title')}
              </label>
              <input
                id="title"
                {...register('title', { 
                  required: t('titleRequired', 'Title is required'),
                  maxLength: {
                    value: 200,
                    message: t('titleMaxLength', 'Title must be less than 200 characters')
                  }
                })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('enterPostTitle', 'Enter post title')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                {t('category', 'Category')}
              </label>
              <select
                id="categoryId"
                {...register('categoryId', { required: t('categoryRequired', 'Category is required') })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">{t('selectCategory', 'Select a category')}</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                {t('content', 'Content')}
              </label>
              <textarea
                id="content"
                {...register('content', { required: t('contentRequired', 'Content is required') })}
                rows={10}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('writePostContent', 'Write your post content here...')}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {createPostMutation.error && (
              <div className="text-red-600 text-sm">
                {(createPostMutation.error as any)?.response?.data?.error || t('postCreationFailed', 'Failed to create post')}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                id="submit-post"
                label={createPostMutation.status === 'pending' || isSubmitting ? t('creating', 'Creating...') : t('createPost', 'Create Post')}
                onClick={handleSubmit(onSubmit)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={createPostMutation.status === 'pending' || isSubmitting}
                aria-label={t('createPost', 'Create post')}
              >
                {createPostMutation.status === 'pending' || isSubmitting ? t('creating', 'Creating...') : t('createPost', 'Create Post')}
                <FiSend className="inline-block" />
              </Button>
              <Button
                label={t('cancel', 'Cancel')}
                onClick={() => setIsConfirmVisible(true)}
                className="cancel"
              >
                {t('cancel', 'Cancel')}
                <FiX className="inline-block" />
              </Button>
            </div>
            {isConfirmVisible && (
              <Confirmation
                message={t('discardChangesConfirmation', 'is it ok to discard changes?')}
                onConfirm={confirmCancel}
                onCancel={cancelConfirmation}
              />
            )}
          </form>
          <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;