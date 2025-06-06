import { render, screen, fireEvent } from '@testing-library/react';
import { Welcome } from '../../../src/pages/steps/Welcome';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('react-icons/md', () => ({ MdAutoAwesome: () => <span>icon</span> }));
jest.mock('../../../src/components/Steps/Steps', () => ({
  Steps: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('../../../src/components/Steps/StepContext', () => {
  let setFormData = jest.fn();
  let formData = {};
  return {
    useStep: () => ({ formData, setFormData }),
    __setSetFormData: (fn: any) => { setFormData = fn; },
    __setFormData: (data: any) => { formData = data; },
  };
});

describe('Welcome page', () => {
  it('利用規約・同意ラジオボタンが表示される', () => {
    render(<Welcome />);
    // "利用規約"を含む要素が1つ以上存在することを確認
    expect(screen.getAllByText(/利用規約/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/I agree/)).toBeInTheDocument();
    expect(screen.getByLabelText(/I do not agree/)).toBeInTheDocument();
  });

  it('ラジオボタン選択でsetFormDataが呼ばれる', () => {
    const { __setSetFormData } = require('../../../src/components/Steps/StepContext');
    const setFormData = jest.fn();
    __setSetFormData(setFormData);
    render(<Welcome />);
    fireEvent.click(screen.getByLabelText(/I agree/));
    expect(setFormData).toHaveBeenCalledWith({ agreement: 'agree' });
    fireEvent.click(screen.getByLabelText(/I do not agree/));
    expect(setFormData).toHaveBeenCalledWith({ agreement: 'disagree' });
  });

  it('formData.agreementが初期値として反映される', () => {
    const { __setFormData } = require('../../../src/components/Steps/StepContext');
    __setFormData({ agreement: 'agree' });
    render(<Welcome />);
    expect(screen.getByLabelText(/I agree/)).toBeChecked();
  });
});

export {};
