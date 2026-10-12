export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-xl border border-line bg-bg p-1">
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${value === t.id ? 'bg-surface text-brand shadow-soft' : 'text-muted hover:text-ink'}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
