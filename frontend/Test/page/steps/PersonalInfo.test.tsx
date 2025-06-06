import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PersonalInfo } from '../../../src/pages/steps/PersonalInfo';
import * as StepContext from '../../../src/components/Steps/StepContext';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('react-icons/md', () => ({ MdPerson: () => <span>icon</span> }));
jest.mock('../../../src/components/Steps/Steps', () => ({
  Steps: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('../../../src/components/Steps/StepContext', () => {
  let setFormData = jest.fn();
  return {
    useStep: () => ({ formData: {}, setFormData }),
    __setSetFormData: (fn: any) => { setFormData = fn; },
  };
});

// react-hook-formは本物を使う（バリデーション挙動テストのため）

describe('PersonalInfo page', () => {
  it('全ての入力フィールドが表示される', () => {
    render(<PersonalInfo />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  it('空欄でsubmit時にバリデーションエラーが表示される', async () => {
    const { container } = render(<PersonalInfo />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);
    await waitFor(() => {
      expect(screen.queryByText('Name is required')).toBeInTheDocument();
      expect(screen.queryByText('Invalid email address')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('有効な入力でsetFormDataが呼ばれる', async () => {
    const setFormData = jest.fn();
    jest.spyOn(StepContext, 'useStep').mockReturnValue({
      formData: {},
      setFormData,
      currentStep: 0,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      setStep: jest.fn(),
      isLastStep: false,
    });
    render(<PersonalInfo />);
    fireEvent.input(screen.getByLabelText(/Full Name/i), { target: { value: 'Taro' } });
    fireEvent.input(screen.getByLabelText(/Email Address/i), { target: { value: 'taro@example.com' } });
    fireEvent.input(screen.getByLabelText(/Phone Number/i), { target: { value: '09012345678' } });
    // 入力値が変更されるたびにsetFormDataが呼ばれる
    await waitFor(() => {
      expect(setFormData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Taro', email: 'taro@example.com', phone: '09012345678' })
      );
    });
  });
});

export {};
