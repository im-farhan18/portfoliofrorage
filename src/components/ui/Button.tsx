import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

/** Class helper so links (<Link>) can look exactly like buttons. */
export const btnClass = (variant: Variant = 'secondary', size: Size = 'md', extra = ''): string =>
  [
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2.5 text-sm',
    variant === 'primary'
      ? 'bg-brand text-white shadow-soft hover:brightness-110'
      : variant === 'secondary'
        ? 'border border-line bg-surface text-ink hover:border-brand'
        : variant === 'danger'
          ? 'text-red-500 hover:bg-red-500/10'
          : 'text-ink hover:bg-ink/5',
    extra,
  ].join(' ');

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; icon?: ReactNode }

export function Button({ variant, size, icon, className = '', children, type = 'button', ...rest }: Props) {
  return (
    <button type={type} className={btnClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}
