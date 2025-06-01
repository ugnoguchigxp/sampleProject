import { render, screen } from '@testing-library/react';
import Confirmation from '../../src/components/Confirmation';

// i18nのt関数をモック
function t(_key: string, def: string) { return def; }
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t })
}));

describe('Confirmation component', () => {
  it('renders message and buttons', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <Confirmation message="Are you sure?" onConfirm={onConfirm} onCancel={onCancel} />
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText(t('yes', 'はい'))).toBeInTheDocument();
    expect(screen.getByText(t('no', 'いいえ'))).toBeInTheDocument();
  });

  it('calls onConfirm when clicking yes button', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <Confirmation message="Msg" onConfirm={onConfirm} onCancel={onCancel} />
    );
    screen.getByText(t('yes', 'はい')).click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when clicking no button', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <Confirmation message="Msg" onConfirm={onConfirm} onCancel={onCancel} />
    );
    screen.getByText(t('no', 'いいえ')).click();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
