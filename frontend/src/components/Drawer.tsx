interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  position?: 'left' | 'right';
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, position = 'right' }) => {
  const drawerPositionClass = position === 'left' ? '-translate-x-full' : 'translate-x-full';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        id="drawer"
        className={`fixed top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : drawerPositionClass} ${position === 'left' ? 'left-0' : 'right-0'}`}
      >
        <div className="p-4">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
