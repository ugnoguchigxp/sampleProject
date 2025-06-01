import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '../../src/components/LanguageSelector';

// Stub i18next and capture changeLanguage mock
const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en', changeLanguage: mockChangeLanguage },
    t: (_key: string, defaultValue: string) => defaultValue,
  }),
}));

// Stub Selector component with typed props to avoid implicit any
jest.mock('../../src/components/Selector', () => ({
  default: (props: {
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    selectedValue?: string;
  }) => (
    <div>
      <span data-testid="selected">{props.selectedValue}</span>
      {props.options.map(opt => (
        <button 
          key={opt.value} 
          data-testid={`opt-${opt.value}`} 
          onClick={() => props.onSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

describe('LanguageSelector component', () => {
  it('renders current language label based on i18n.language', () => {
    render(<LanguageSelector />);
    expect(screen.getByTestId('selected')).toHaveTextContent('en');
  });

  it('calls changeLanguage when selecting a new language', () => {
    const { getByTestId } = render(<LanguageSelector />);
    fireEvent.click(getByTestId('opt-ja'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('ja');
  });
});
