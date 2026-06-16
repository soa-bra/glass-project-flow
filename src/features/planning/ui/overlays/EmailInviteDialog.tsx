import React, { useState } from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BoardInviteRole } from '@/hooks/useBoardInvites';

interface EmailInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  onSendInvite: (input: { email: string; role: BoardInviteRole }) => Promise<unknown>;
}

const roleLabels: Record<BoardInviteRole, string> = {
  viewer: 'قارئ',
  editor: 'محرر',
  commenter: 'معلّق',
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const EmailInviteDialog: React.FC<EmailInviteDialogProps> = ({
  isOpen,
  onClose,
  isLoading,
  error,
  success,
  onSendInvite,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<BoardInviteRole>('viewer');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    if (!isValidEmail(email)) {
      setValidationError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    const invite = await onSendInvite({ email, role });
    if (invite) {
      setEmail('');
      setRole('viewer');
    }
  };

  if (!isOpen) return null;

  const visibleError = validationError || error;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 z-50 w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
        dir="rtl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-sb-ink">دعوة بالبريد الإلكتروني</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-sb-panel-bg"
            aria-label="إغلاق"
          >
            <X size={16} className="text-sb-ink-40" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-center py-2">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sb-panel-bg">
              <Mail size={24} className="text-sb-ink-40" />
            </div>
            <p className="text-[12px] leading-relaxed text-sb-ink-60">
              سيتم حفظ الدعوة على اللوحة. إرسال البريد الفعلي يحتاج تكامل بريد لاحقًا.
            </p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-[12px] font-medium text-sb-ink-70">البريد الإلكتروني</span>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setValidationError(null);
              }}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-sb-border bg-white px-3 py-2.5 text-[13px] text-sb-ink outline-none transition-colors focus:border-sb-ink"
              disabled={isLoading}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[12px] font-medium text-sb-ink-70">الصلاحية</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as BoardInviteRole)}
              className="w-full rounded-lg border border-sb-border bg-white px-3 py-2.5 text-[13px] text-sb-ink outline-none transition-colors focus:border-sb-ink"
              disabled={isLoading}
            >
              {(Object.keys(roleLabels) as BoardInviteRole[]).map((value) => (
                <option key={value} value={value}>{roleLabels[value]}</option>
              ))}
            </select>
          </label>

          {visibleError && (
            <p className="rounded-lg bg-[#FFE1E0] px-3 py-2 text-[12px] text-[#E5564D]">
              {visibleError}
            </p>
          )}

          {success && !visibleError && (
            <p className="rounded-lg bg-[#E6F7EF] px-3 py-2 text-[12px] text-[#25845F]">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sb-ink px-4 py-3 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            إرسال دعوة
          </button>
        </form>
      </motion.div>
    </>
  );
};
