import { Link } from 'react-router-dom';
import { FaHome, FaCog, FaUser, FaBell, FaQuestionCircle, FaClipboard, FaChevronDown, FaChevronRight, FaPlus, FaMinus, FaChartBar } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/useIsMobile';


interface TreeNode {
  id: string;
  label: string;
  path: string; // path プロパティを追加
  icon: string; // icon プロパティを追加
  children?: TreeNode[];
}

interface TreeMenuProps {
  onSelect: (id: string) => void;
}

const TreeMenu: React.FC<TreeMenuProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (id: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(id)) {
      newExpandedNodes.delete(id);
    } else {
      newExpandedNodes.add(id);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const expandAll = () => {
    const allNodeIds = new Set(menuData.map(node => node.id));
    setExpandedNodes(allNodeIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // MenuData を JSON としてベタ書き
  const menuData: TreeNode[] = [
    {
      id: 'bbs',
      label: 'Sample BBS',
      path: '/bbs/list',
      icon: 'FaClipboard',
    },
    {
      id: 'stepInput',
      label: 'Step Input',
      path: '/step-input',
      icon: 'FaHome',
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: 'FaCog',
      children: [
        {
          id: 'user',
          label: 'User Settings',
          path: '/settings/user',
          icon: 'FaUser',
        },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/notifications',
      icon: 'FaBell',
    },
    {
      id: 'charts',
      label: 'Sample Charts',
      path: '/charts',
      icon: 'FaChartBar',
    },
  ];

  const iconMap = {
    FaHome: FaHome,
    FaCog: FaCog,
    FaUser: FaUser,
    FaBell: FaBell,
    FaQuestionCircle: FaQuestionCircle,
    FaClipboard: FaClipboard,
    FaChartBar: FaChartBar,
  };

  const renderTree = (nodes: TreeNode[], level = 0) => {
    return (
      <ul className={level > 0 ? 'pl-2' : ''}>
        {nodes.map((node) => {
          const Icon = iconMap[node.icon as keyof typeof iconMap] || FaQuestionCircle;
          const isExpanded = expandedNodes.has(node.id);
          return (
            <li key={node.id} className={`mb-2 tree-menu-level-${level}`}>
              <div className="flex items-center justify-between w-full">
                <Link
                  to={node.path}
                  onClick={() => onSelect(node.id)}
                  className="text-left text-gray-700 hover:text-blue-600 focus:outline-none flex items-center flex-grow py-2"
                >
                  <Icon className="mr-2" />
                  {t(node.id)}
                </Link>
                {node.children && (
                  <button
                    onClick={() => toggleNode(node.id)}
                    className="focus:outline-none p-2"
                  >
                    {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                )}
              </div>
              {node.children && isExpanded && renderTree(node.children, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  const isMobile = useIsMobile();

  // モバイル表示とPC表示で共通の部分
  const treeContent = (
    <div className="tree-menu w-full">
      <div className="control-bar flex justify-between items-center mb-2 bg-primary px-2 py-1 space-x-1 w-full">
        <div className="flex items-center text-white font-bold">
          {t('Menu','Menu')}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={expandAll}
            className="p-1 text-white hover:text-gray-200 focus:outline-none"
            aria-label="全展開"
          >
            <FaPlus size={'0.8rem'} />
          </button>
          <button
            onClick={collapseAll}
            className="p-1 text-white hover:text-gray-200 focus:outline-none"
            aria-label="全折りたたみ"
          >
            <FaMinus size={'0.8rem'} />
          </button>
        </div>
      </div>
      <div className={isMobile ? 'w-full' : 'hidden md:block'}>
        {renderTree(menuData)}
      </div>
    </div>
  );

  return treeContent;
};

export default TreeMenu;