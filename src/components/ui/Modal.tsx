import { useEffect, useRef, type ReactNode } from 'react';

/** Accessible dialog built on the native <dialog> element (focus trap + Esc come for free). */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="w-[min(92vw,28rem)] rounded-2xl border border-line bg-surface p-0 text-ink shadow-soft backdrop:bg-black/50 backdrop:backdrop-blur-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
