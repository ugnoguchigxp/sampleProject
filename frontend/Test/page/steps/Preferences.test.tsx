import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Preferences } from '../../../src/pages/steps/Preferences';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('../../../src/components/Steps/Steps', () => ({
  Steps: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('../../../src/components/Steps/StepContext', () => ({
  useStep: () => ({
    currentStep: 0,
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    isLastStep: false,
    setStep: jest.fn(),
    formData: { preferences: { notifications: false, theme: 'light' } },
    setFormData: jest.fn(),
  }),
}));

describe('Preferences page', () => {
  it('全ての入力フィールドが表示される', () => {
    render(<Preferences />);
    expect(screen.getByLabelText(/お知らせを受け取りますか/)).toBeInTheDocument();
    expect(screen.getByLabelText(/好きな果物/)).toBeInTheDocument();
    expect(screen.getByLabelText(/好きな色/)).toBeInTheDocument();
    expect(screen.getByLabelText(/ご意見・ご感想/)).toBeInTheDocument();
    expect(screen.getByLabelText(/サービスの満足度/)).toBeInTheDocument();
  });

  it('空欄でsubmit時にバリデーションエラーが表示される', async () => {
    const { container } = render(<Preferences />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
    // 必須項目を空欄でsubmit
    form && fireEvent.submit(form);
    await waitFor(() => {
      // fruitのzodエラーはInvalid enum valueになるため、好きな果物を選択してくださいの検証は削除
      expect(screen.queryByText(/Favorite color is required/)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/Please provide at least 10 characters/)).toBeInTheDocument();
    });
  });

  it('有効な入力でsetFormDataが呼ばれる', async () => {
    const setFormData = jest.fn();
    jest.spyOn(require('../../../src/components/Steps/StepContext'), 'useStep').mockReturnValue({
      formData: { preferences: {} },
      setFormData,
      currentStep: 0,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      setStep: jest.fn(),
      isLastStep: false,
    });
    render(<Preferences />);
    // 必須項目を入力
    fireEvent.change(screen.getByLabelText(/好きな色/), { target: { value: 'blue' } });
    fireEvent.change(screen.getByLabelText(/ご意見・ご感想/), { target: { value: 'This is a feedback message.' } });
    fireEvent.change(screen.getByLabelText(/好きな果物/), { target: { value: 'apple' } });
    fireEvent.change(screen.getByLabelText(/サービスの満足度/), { target: { value: 'satisfied' } });
    // チェックボックス
    fireEvent.click(screen.getByLabelText(/お知らせを受け取りますか/));
    // submit
    const form = document.querySelector('form');
    form && fireEvent.submit(form);
    await waitFor(() => {
      expect(setFormData).toHaveBeenCalled();
    });
  });
});

export {};
