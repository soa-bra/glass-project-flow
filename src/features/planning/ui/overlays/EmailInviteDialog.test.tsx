import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmailInviteDialog } from './EmailInviteDialog';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

describe('EmailInviteDialog', () => {
  it('يعرض خطأ للإيميل غير الصالح ولا يستدعي الحفظ', async () => {
    const onSendInvite = vi.fn();
    render(
      <EmailInviteDialog
        isOpen
        onClose={vi.fn()}
        isLoading={false}
        error={null}
        success={null}
        onSendInvite={onSendInvite}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'bad-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'إرسال دعوة' }));

    expect(onSendInvite).not.toHaveBeenCalled();
    expect(screen.getByText('يرجى إدخال بريد إلكتروني صالح')).toBeInTheDocument();
  });

  it('يستخدم viewer كصلاحية افتراضية عند إرسال إيميل صالح', async () => {
    const onSendInvite = vi.fn().mockResolvedValue({ id: 'invite-1' });
    render(
      <EmailInviteDialog
        isOpen
        onClose={vi.fn()}
        isLoading={false}
        error={null}
        success={null}
        onSendInvite={onSendInvite}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'valid@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'إرسال دعوة' }));

    expect(onSendInvite).toHaveBeenCalledWith({ email: 'valid@example.com', role: 'viewer' });
  });
});
