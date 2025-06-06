import { useState, useRef, useEffect, forwardRef } from 'react';

interface SelectorProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  selectedValue?: string;
  className?: string;
  inputProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const Selector = forwardRef<HTMLButtonElement, SelectorProps>(
  ({ options, onSelect, selectedValue, className, inputProps }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node) &&
          !event.composedPath().some((el) => (el as HTMLElement).tagName === 'UL')
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpwards(spaceBelow < 200);
      }
    }, [isOpen]);

    const handleSelect = (value: string) => {
      onSelect(value);
      setIsOpen(false);
    };

    const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || '選択してください';

    return (
      <div className="relative">
        <button
          ref={ref as any || buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none ${className || ''}`}
          type="button"
          {...inputProps}
        >
          {selectedLabel}
        </button>
        {isOpen && (
          <ul
            className={`absolute ${openUpwards ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 bg-white border rounded-md shadow-lg z-10 ${className || ''}`}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`px-4 py-2 cursor-pointer transition-colors duration-100
                  ${selectedValue === opt.value ? 'bg-blue-400 text-white font-bold' : 'hover:bg-blue-200'}
                `}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

export default Selector;
