import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { postsApi } from '../../services/bbs/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Post, Comment } from '../../types/bbs';
import { FaTrashAlt } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Toast from '../../components/Toast';
import { useIsMobile } from '../../hooks/useIsMobile';
import Button from '../../components/Button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createCommentSchema = (t: (key: string) => string) => z.object({
  content: z.string()
    .min(1, t('commentRequired'))
});

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const commentSchema = createCommentSchema(t);
  type CommentForm = z.infer<typeof commentSchema>;
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema)
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const isMobile = useIsMobile();

  const { data: post, status } = useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPost(id!).then(res => res.data),
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: (data: { content: string }) => postsApi.addComment(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      reset();
      setToastMsg(t('commentCreated', 'Comment posted successfully'));
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3500);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: () => postsApi.deletePost(id!),
    onSuccess: () => {
      navigate('/');
    },
  });

  const onSubmitComment = (data: CommentForm): void => {
    addCommentMutation.mutate(data);
  };

  const handleDeletePost = (): void => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate();
    }
  };

  if (status === 'pending') {
    return (
      <div className={`flex justify-center items-center h-64 ${isMobile ? 'px-2' : ''}`}>
        <div className={`text-lg text-gray-600 ${isMobile ? 'text-base' : ''}`}>Loading post...</div>
      </div>
    );
  }

  if (status === 'error' || !post) {
    return (
      <div className={`flex justify-center items-center h-64 ${isMobile ? 'px-2' : ''}`}>
        <div className={`text-lg text-red-600 ${isMobile ? 'text-base' : ''}`}>Post not found</div>
      </div>
    );
  }

  return (
    <div id="bbs-post-detail-page" className={`max-w-4xl mx-auto px-4 py-6 ${isMobile ? 'px-2 py-3' : ''}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-2'}`}>
            {post.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {post.category.name}
              </span>
            )}
            <span className="text-sm text-gray-500">
              by {post.author?.username || 'Unknown'}
            </span>
            <span className="text-sm text-gray-500">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {user?.id === post.author?.id && (
              <Button
                label={t('delete')}
                onClick={handleDeletePost}
                className="error"
                icon={<FaTrashAlt className="mr-1" />}
                disabled={deletePostMutation.status === 'pending'}
              />
            )}
          </div>
        </div>
        <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${isMobile ? 'text-xl' : ''}`}>{post.title}</h1>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({post.comments?.length || 0})
        </h2>

        {isAuthenticated() && (
          <form onSubmit={handleSubmit(onSubmitComment)} className="mb-6">
            <div className="mb-4">
              <textarea
                {...register('content')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('writeComment', 'Write a comment...')}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
            <Button
              id="post-comment-button"
              label={addCommentMutation.status === 'pending' ? t('posting', 'Posting...') : t('postComment', 'Post Comment')}
              type="submit"
              disabled={addCommentMutation.status === 'pending'}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              aria-label={t('postComment', 'Post Comment')}>
              <FiSend className="inline-block" />
            </Button>
          </form>
        )}

        <div className="space-y-4">
          {post.comments?.map((comment: Comment) => (
            <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="font-medium text-gray-900">{comment.author?.username || 'Anonymous'}</div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
          
          {(!post.comments || post.comments.length === 0) && (
            <p className="text-gray-500 text-center py-8">
              No comments yet. {!isAuthenticated && (
                <>
                  <a href="/login" className="text-blue-600 hover:text-blue-500">
                    Login
                  </a>
                  {' '}to post the first comment!
                </>
              )}
            </p>
          )}
        </div>
      </div>
      {/* 戻るボタンをコメント欄の下に移動 */}
      <div className="mt-6">
        <Button
          label={t('goBackHome', 'Back to Home')}
          onClick={() => navigate("/")}
          className="bg-secondary hover:bg-secondary-dark text-secondary-text py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2"
        />
      </div>
      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
};

export default PostDetail;