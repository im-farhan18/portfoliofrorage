import { useId, useRef, useState, type ReactNode } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface Base { label: string; hint?: string; error?: string; required?: boolean }

function Shell({ id, label, hint, error, required, show, children, right }: Base & { id: string; show: boolean; children: ReactNode; right?: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500" aria-hidden="true"> *</span>}
        </label>
        {right}
      </div>
      {children}
      {show ? <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-red-500">{error}</p> : hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

interface TextProps extends Base {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; maxLength?: number; autoComplete?: string;
}
export function TextInput({ label, hint, error, required, value, onChange, type = 'text', placeholder, maxLength, autoComplete }: TextProps) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const show = !!error && (touched || value.trim() !== '');
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} show={show}>
      <input id={id} className="field" type={type} value={value} placeholder={placeholder} maxLength={maxLength} autoComplete={autoComplete}
        aria-invalid={show} aria-describedby={show ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)} onBlur={() => setTouched(true)} />
    </Shell>
  );
}

export function TextArea({ label, hint, error, required, value, onChange, placeholder, maxLength, rows = 4 }: TextProps & { rows?: number }) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const show = !!error && (touched || value.trim() !== '');
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} show={show}
      right={maxLength ? <span className={`text-xs ${value.length > maxLength * 0.95 ? 'text-orange-500' : 'text-muted'}`}>{value.length}/{maxLength}</span> : undefined}>
      <textarea id={id} className="field resize-y" rows={rows} value={value} placeholder={placeholder} maxLength={maxLength}
        aria-invalid={show} onChange={(e) => onChange(e.target.value)} onBlur={() => setTouched(true)} />
    </Shell>
  );
}

export function SelectInput({ label, hint, value, onChange, options }: Base & { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} show={false}>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Shell>
  );
}

export function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-3">
      <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-surface p-1" />
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <code className="text-xs text-muted">{value}</code>
    </div>
  );
}

interface UploadProps {
  label: string; accept: string; hint?: string; onFile: (f: File) => Promise<void>; onRemove: () => void;
  /** image data URL for the preview */ preview?: string; /** name shown for non-image files */ fileName?: string; hasFile: boolean; round?: boolean;
}
export function FileUpload({ label, accept, hint, onFile, onRemove, preview, fileName, hasFile, round }: UploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const pick = async (f?: File) => {
    if (!f) return;
    setBusy(true); setErr('');
    try { await onFile(f); } catch (e) { setErr(e instanceof Error ? e.message : 'That file could not be used.'); }
    setBusy(false);
    if (ref.current) ref.current.value = '';
  };
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface p-4">
      <div className="flex items-center gap-4">
        <div className={`grid h-16 w-16 flex-none place-items-center overflow-hidden bg-bg text-muted ${round ? 'rounded-full' : 'rounded-xl'}`}>
          {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={22} aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="truncate text-xs text-muted">{hasFile && fileName ? fileName : hint}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => ref.current?.click()} disabled={busy}>{busy ? 'Working…' : hasFile ? 'Change' : 'Upload'}</Button>
            {hasFile && <Button size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={onRemove}>Remove</Button>}
          </div>
        </div>
      </div>
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => void pick(e.target.files?.[0])} aria-label={label} />
      {err && <p role="alert" className="mt-2 text-xs text-red-500">{err}</p>}
    </div>
  );
}
