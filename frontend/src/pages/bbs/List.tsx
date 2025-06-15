import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../../services/bbs/api';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import Pagination from '../../components/Pagination';
import { FiPlus } from 'react-icons/fi';
import Button from '../../components/Button';
import { ModalContextType } from '../../components/Layout';

const List: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { setIsModalOpen, setNewPostButton } = useOutletContext<ModalContextType>();

  const postButton = isMobile ? (
    <Button
      id="create-post-button"
      onClick={() => setIsModalOpen(true)}
      icon={FiPlus}
      aria-label={t('createPost', 'Create post')}
      className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white flex items-center justify-center shadow-lg p-0"
    />
  ) : (
    <Button
      id="create-post-button"
      onClick={() => setIsModalOpen(true)}
      icon={FiPlus}
      label={t('createPost', 'Create post')}
      className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg px-4 py-2 rounded-md transition-colors duration-200"
    />
  );

  useEffect(() => {
    setNewPostButton?.(postButton);
    return () => {
      setNewPostButton?.(undefined);
      setIsModalOpen(false);
    };
  }, [setNewPostButton, setIsModalOpen]);

  const { data, status } = useQuery<{ posts: any[]; total: number }, Error>({
    queryKey: ['posts', page],
    queryFn: () => postsApi.getPosts(page, pageSize).then(res => res.data),
    meta: { keepPreviousData: true },
  });
  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">{t('loadingPosts', 'Loading posts...')}</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{t('errorLoadingPosts', 'Error loading posts')}</div>
      </div>
    );
  }

  return (
    <div id="bbs-list-page" className={`px-4 py-4 ${isMobile ? 'pt-2 pb-2' : ''}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold text-gray-900 ${isMobile ? 'text-lg' : ''}`}>{t('latestPosts', 'Latest Posts')}</h1>
        <p className={`mt-1 text-gray-600 ${isMobile ? 'text-sm' : ''}`}>{t('sampleBBS', 'Sample BBS')}</p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-gray-500 text-base ${isMobile ? 'text-sm' : ''}`}>{t('noPosts', 'No posts yet')}</div>
          <p className={`text-gray-400 mt-1 ${isMobile ? 'text-xs' : ''}`}>{t('beFirst', 'Be the first to create a post!')}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className={`min-w-full bg-white border border-gray-200 rounded-lg ${isMobile ? 'text-xs' : ''}`}>
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b text-left">{t('title', 'タイトル')}</th>
                  <th className="px-3 py-2 border-b text-left">{t('category', 'カテゴリ')}</th>
                  <th className="px-3 py-2 border-b text-left">{t('author', '投稿者')}</th>
                  {!isMobile && (
                    <th className="px-3 py-2 border-b text-left">{t('date', '日付')}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-2 border-b">
                      <Link to={`/posts/${post.id}`} className="text-blue-700 hover:underline" data-testid="post-title">
                        {/* mobile時文字数制限 */}
                        {isMobile && post.title.length > 25 
                          ? `${post.title.slice(0, 25)}...` 
                          : post.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 border-b">
                      {isMobile 
                        ? (post.category?.name && post.category.name.length > 10 ? `${post.category.name.slice(0, 10)}...` : post.category?.name ?? '')
                        : (post.category?.name ?? '')
                      }
                    </td>
                    <td className="px-3 py-2 border-b">
                      {isMobile
                        ? (post.author?.username && post.author.username.length > 10 ? `${post.author.username.slice(0, 10)}...` : post.author?.username ?? '')
                        : (post.author?.username ?? '')
                      }
                    </td>
                    {!isMobile && (
                      <td className="px-3 py-2 border-b">{new Date(post.createdAt).toLocaleDateString()}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalPosts={total}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}

      <div className="mt-6 text-left">
        <Link
          to="/"
          className="px-3 py-2 bg-secondary text-secondary.text rounded-md hover:bg-secondary"
        >
          {t('goBackHome', 'Homeに戻る')}
        </Link>
      </div>
    </div>
  );
};

export default List;
