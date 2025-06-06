import { render, screen } from '@testing-library/react';
import { Review } from '../../../src/pages/steps/Review';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('react-icons/md', () => ({ MdChecklist: () => <span>icon</span> }));
jest.mock('../../../src/components/Steps/Steps', () => ({
  Steps: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('../../../src/components/Steps/StepContext', () => ({
  useStep: () => ({
    formData: {
      name: 'Taro',
      email: 'taro@example.com',
      phone: '09012345678',
      agreement: 'agree',
      preferences: {
        notifications: true,
        fruit: 'apple',
        favoriteColor: 'blue',
        feedback: 'Great service!',
        satisfaction: 'satisfied',
        improvement: 'None',
      },
    },
  }),
}));

describe('Review page', () => {
  it('全体の情報が表示される', () => {
    render(<Review />);
    // メイン情報
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('Taro')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('taro@example.com')).toBeInTheDocument();
    expect(screen.getByText('phone')).toBeInTheDocument();
    expect(screen.getByText('09012345678')).toBeInTheDocument();
    expect(screen.getByText('agreement')).toBeInTheDocument();
    expect(screen.getByText('agree')).toBeInTheDocument();
    // preferences
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('notifications')).toBeInTheDocument();
    // boolean値はt('yes')→'yes'、t('no')→'no'で出る
    expect(screen.getByText('yes')).toBeInTheDocument();
    expect(screen.getByText('fruit')).toBeInTheDocument();
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('favoriteColor')).toBeInTheDocument();
    expect(screen.getByText('blue')).toBeInTheDocument();
    expect(screen.getByText('feedback')).toBeInTheDocument();
    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.getByText('satisfaction')).toBeInTheDocument();
    expect(screen.getByText('satisfied')).toBeInTheDocument();
    expect(screen.getByText('improvement')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    // 完了案内
    expect(screen.getByText('pleaseClickComplete')).toBeInTheDocument();
  });

  it('未入力項目はnotEnteredが表示される', () => {
    jest.spyOn(require('../../../src/components/Steps/StepContext'), 'useStep').mockReturnValue({
      formData: {
        name: '',
        email: '',
        preferences: { feedback: '' },
      },
    });
    render(<Review />);
    // 未入力はt('notEntered')→'notEntered'で出る
    expect(screen.getAllByText('notEntered').length).toBeGreaterThan(0);
  });
});

export {};
