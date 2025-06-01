type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs rounded py-1 px-2 z-50 shadow-md transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100 group-hover:visible whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
