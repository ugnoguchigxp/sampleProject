import { useState, ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiLogIn, FiUserPlus, FiUser, FiLogOut } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';
import Drawer from '../components/Drawer';
import Tooltip from '../components/Tooltip';
import Modal from '../components/Modal';
import CreatePost from '../pages/bbs/CreatePost';
import LanguageSelector from '../components/LanguageSelector';
import Button from '../components/Button';
import TreeMenu from '../components/TreeMenu';

export type ModalContextType = {
  setIsModalOpen: (isOpen: boolean) => void;
  setNewPostButton?: (node: ReactNode | undefined) => void;
};

const Layout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostButton, setNewPostButton] = useState<ReactNode>();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='overflow-hidden'>
      <nav className="bg-white">
        <div>
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900 flex items-center">
                {t('sampleProject', 'Sample Project')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector className="mr-4" />
              {/* 下の構造から新規投稿　ボタンを受け取ってレンダリング */}
              {newPostButton}
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CreatePost onClose={closeModal} />
              </Modal>
              {isAuthenticated() ? (
                <div className="relative">
                  <Tooltip text={t('click_for_details', 'クリックで詳細表示')}>
                    <button
                      onClick={() => setDropdownOpen((open) => !open)}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      aria-label="User menu"
                      type="button"
                    >
                      <FiUser className="text-xl text-gray-700" />
                    </button>
                  </Tooltip>
                  <Drawer
                    isOpen={dropdownOpen}
                    onClose={() => setDropdownOpen(false)}
                  >
                    <div className="flex flex-col items-center mb-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200">
                        <FiUser className="text-3xl text-gray-700" />
                      </div>
                      <span className="mt-2 text-gray-700 text-sm font-medium">
                        {user?.username || <span className="text-red-500 text-xs">ユーザー名未取得</span>}
                      </span>
                    </div>
                    <Button
                      label={t('logout', 'Logout')}
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut />
                    </Button>
                  </Drawer>
                </div>
              ) : (
                <>
                  <Tooltip text={t('login', 'Login')}>
                    <Link
                      to="/login"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      aria-label="Login"
                    >
                      <FiLogIn className="text-xl text-gray-700" />
                    </Link>
                  </Tooltip>
                  <Tooltip text={t('register', 'Register')}>
                    <Link
                      to="/register"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      aria-label="Register"
                    >
                      <FiUserPlus className="text-xl text-gray-700" />
                    </Link>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden flex justify-between items-center px-4 py-2 border-t bg-white">
          <Tooltip text={t('menu', 'メニュー')}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              aria-label="Menu"
            >
              <FaBars className="text-xl text-gray-700" />
            </button>
          </Tooltip>
        </div>
        <Drawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          position="left"
        >
          <TreeMenu onSelect={() => setIsMobileMenuOpen(false)} />
        </Drawer>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 下の階層から callbackを受け取る為のもの */}
        <Outlet context={{ setIsModalOpen, setNewPostButton }} />
      </main>
    </div>
  );
};

export default Layout;