import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePost from '../../../src/pages/bbs/CreatePost';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));
jest.mock('../../../src/hooks/useIsMobile', () => ({ useIsMobile: () => false }));
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [], status: 'success' }),
  useMutation: () => ({ mutate: jest.fn(), status: 'success' }),
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));

const onClose = jest.fn();

describe('bbs/CreatePost page', () => {
  it('renders form fields', () => {
    render(<CreatePost onClose={onClose} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(<CreatePost onClose={onClose} />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    // 確認ダイアログの表示を十分に待つ
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          /discard changes|is it ok to discard changes/i.test(content)
        )
      ).toBeInTheDocument();
    }, { timeout: 2000 });
    const yesBtn = await screen.findByText(/はい|yes/i);
    fireEvent.click(yesBtn);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('does not call onClose when cancel is dismissed', async () => {
    const localOnClose = jest.fn();
    render(<CreatePost onClose={localOnClose} />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          /discard changes|is it ok to discard changes/i.test(content)
        )
      ).toBeInTheDocument();
    }, { timeout: 2000 });
    const noBtn = await screen.findByText(/いいえ|no/i);
    fireEvent.click(noBtn);
    // すぐには閉じないことを確認
    await waitFor(() => {
      expect(localOnClose).not.toHaveBeenCalled();
    }, { timeout: 500 });
    // さらに「キャンセル」ダイアログが消えることも確認
    await waitFor(() => {
      expect(
        screen.queryByText((content) =>
          /discard changes|is it ok to discard changes/i.test(content)
        )
      ).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
