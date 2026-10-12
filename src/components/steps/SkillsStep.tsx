import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Skill, SkillCategory } from '../../types/portfolio';
import { SKILL_CATEGORIES } from '../../engine/options';
import { splitList } from '../../engine/sanitize';
import { newId } from '../../data/demo';
import { Button } from '../ui/Button';
import { SelectInput, TextInput } from '../ui/Field';
import type { StepProps } from './types';

const CATS = SKILL_CATEGORIES.map((c) => ({ value: c, label: c }));

export default function SkillsStep({ data, setData }: StepProps) {
  const [text, setText] = useState('');
  const [cat, setCat] = useState<SkillCategory>('Frontend');
  const add = () => {
    const names = splitList(text);
    if (!names.length) return;
    setData((d) => ({
      ...d,
      skills: [...d.skills, ...names.filter((n) => !d.skills.some((s) => s.category === cat && s.name.toLowerCase() === n.toLowerCase())).map((name) => ({ id: newId(), name, category: cat, level: null }))],
    }));
    setText('');
  };
  const upd = (id: string, patch: Partial<Skill>) => setData((d) => ({ ...d, skills: d.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const del = (id: string) => setData((d) => ({ ...d, skills: d.skills.filter((s) => s.id !== id) }));
  return (
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); add(); }} className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[1fr_9rem_auto]">
        <TextInput label="Add skills" value={text} onChange={setText} placeholder="React, Node.js, SQL" hint="Type one or more skills, separated by commas." />
        <SelectInput label="Category" value={cat} onChange={(v) => setCat(v as SkillCategory)} options={CATS} />
        <Button type="submit" variant="primary" className="sm:mb-[1.4rem] sm:self-end" icon={<Plus size={16} />}>Add</Button>
      </form>
      {SKILL_CATEGORIES.map((c) => {
        const list = data.skills.filter((s) => s.category === c);
        if (!list.length) return null;
        return (
          <section key={c} aria-label={c}>
            <h3 className="mb-2 text-sm font-semibold text-muted">{c}</h3>
            <ul className="space-y-2">
              {list.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2">
                  <input aria-label="Skill name" className="field !w-40 !py-1.5" value={s.name} onChange={(e) => upd(s.id, { name: e.target.value })} />
                  <label className="flex items-center gap-2 text-xs text-muted">
                    <input type="checkbox" checked={s.level !== null} onChange={(e) => upd(s.id, { level: e.target.checked ? 70 : null })} /> Show level
                  </label>
                  {s.level !== null && (
                    <label className="flex flex-1 items-center gap-2 text-xs text-muted">
                      <input type="range" min={10} max={100} step={5} value={s.level} onChange={(e) => upd(s.id, { level: Number(e.target.value) })} className="min-w-[6rem] flex-1 accent-brand" aria-label={`${s.name} level`} />
                      <span className="w-9 text-right tabular-nums">{s.level}%</span>
                    </label>
                  )}
                  <button type="button" onClick={() => del(s.id)} aria-label={`Remove ${s.name}`} className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 size={15} /></button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {data.skills.length === 0 && <p className="text-sm text-muted">No skills yet. Levels are optional: only turn them on if you want them shown.</p>}
    </div>
  );
}
