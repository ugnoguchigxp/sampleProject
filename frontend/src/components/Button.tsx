import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';

type ButtonProps = {
  label?: ReactNode; // ボタンのラベルをReactNode型に変更
  icon?: IconType | ReactNode; // アイコンコンポーネントまたはReactNode
  to?: string; // リンク先 (React Router 用)
  onClick?: () => void; // クリック時のアクション
  className?: string; // カスタムクラス
  disabled?: boolean; // 無効化フラグ
  children?: ReactNode; // 子要素をサポート
  type?: 'button' | 'submit' | 'reset'; // ボタンのタイプを指定
};

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    label,
    icon,
    to,
    onClick,
    className = '',
    disabled = false,
    children,
    type = 'button',
  } = props;
  // ボタンのバリエーションをclassNameで判定
  let colorClass = '';
  if (className.includes('error') || className.includes('danger') || className.includes('delete')) {
    colorClass = 'bg-danger text-danger-text hover:bg-red-700';
  } else if (className.includes('secondary') || className.includes('cancel')) {
    colorClass = 'bg-secondary text-secondary-text hover:bg-gray-500';
  } else {
    colorClass = 'bg-primary text-primary-text hover:bg-blue-700';
  }

  const baseClass = `px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${colorClass} ${className}`;

  const renderIcon = () => {
    if (icon && typeof icon === 'function') {
      const IconComponent = icon as IconType;
      return <IconComponent className="text-lg" />;
    }
    return icon;
  };

  if (to) {
    return (
      <Link to={to} className={baseClass} onClick={disabled ? undefined : onClick}>
        {renderIcon()}
        {label}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClass}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {renderIcon()}
      {label}
      {children}
    </button>
  );
};

export default Button;
