import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "sm"|"md"|"lg";
};
export default function Modal({ open, onClose, title, children, actions, size="md" }: Props){
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${size==="sm"?"max-w-sm": size==="lg"?"max-w-3xl":"max-w-xl"} mx-4`}>
        {title && <div className="px-4 py-3 border-b font-semibold">{title}</div>}
        <div className="p-4">{children}</div>
        {actions && <div className="px-4 py-3 border-t flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}
