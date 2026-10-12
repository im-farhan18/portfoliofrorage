import type { Settings } from '../../types/portfolio';
import { ACCENT_PRESETS, FONT_LABELS, SECTION_LABELS, SECTION_ORDER } from '../../engine/options';
import { ColorInput } from '../ui/Field';
import type { StepProps } from './types';

function Seg<T extends string>({ label, value, options, onChange, hint }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; hint?: string }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((o) => <button key={o.value} type="button" className="chip" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>{o.label}</button>)}
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default function CustomizeStep({ data, setData }: StepProps) {
  const s = data.settings;
  const set = (patch: Partial<Settings>) => setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  return (
    <div className="space-y-6">
      <Seg label="Theme" value={s.theme} onChange={(v) => set({ theme: v })} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'auto', label: 'Auto' }]} hint="Auto follows the visitor’s device setting." />
      <div>
        <p className="mb-1.5 text-sm font-medium">Accent colour</p>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Accent colour">
          {ACCENT_PRESETS.map((c) => (
            <button key={c.value} type="button" title={c.name} aria-label={c.name} aria-pressed={s.accentColor.toLowerCase() === c.value} onClick={() => set({ accentColor: c.value })}
              style={{ background: c.value }} className={`h-8 w-8 rounded-full border-2 transition hover:scale-110 ${s.accentColor.toLowerCase() === c.value ? 'border-ink' : 'border-transparent'}`} />
          ))}
        </div>
        <div className="mt-3"><ColorInput label="Custom colour" value={s.accentColor} onChange={(v) => set({ accentColor: v })} /></div>
      </div>
      <Seg label="Font" value={s.font} onChange={(v) => set({ font: v })} options={(Object.keys(FONT_LABELS) as (keyof typeof FONT_LABELS)[]).map((k) => ({ value: k, label: FONT_LABELS[k] }))} hint="Fonts that every device already has, so the portfolio works offline." />
      <Seg label="Spacing" value={s.layout} onChange={(v) => set({ layout: v })} options={[{ value: 'compact', label: 'Compact' }, { value: 'balanced', label: 'Balanced' }, { value: 'spacious', label: 'Spacious' }]} />
      <Seg label="Animation" value={s.animationLevel} onChange={(v) => set({ animationLevel: v })} options={[{ value: 'off', label: 'Off' }, { value: 'subtle', label: 'Subtle' }, { value: 'standard', label: 'Standard' }, { value: 'high', label: 'High' }]}
        hint="Futuristic templates (CyberPulse, Neon Terminal, Orbit) react the most. Everything is pure CSS and respects “reduce motion”." />
      <div>
        <p className="mb-1.5 text-sm font-medium">Sections to show</p>
        <div className="grid grid-cols-2 gap-2">
          {SECTION_ORDER.map((k) => (
            <label key={k} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              <input type="checkbox" className="accent-brand" checked={s.visibleSections[k] !== false} onChange={(e) => set({ visibleSections: { ...s.visibleSections, [k]: e.target.checked } })} />
              {SECTION_LABELS[k]}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted">Sections with no content are hidden automatically.</p>
      </div>
    </div>
  );
}
