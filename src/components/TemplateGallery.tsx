import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { PortfolioData, TemplateCategory } from '../types/portfolio';
import { CATEGORIES, TEMPLATES } from '../engine/templates';
import TemplateThumb from './TemplateThumb';

interface Props {
  data: PortfolioData;
  selected?: string;
  onSelect: (id: string) => void;
  /** full Tailwind grid classes, e.g. "grid-cols-2" */
  cols?: string;
  actionLabel?: string;
  thumbHeight?: number;
}

export default function TemplateGallery({ data, selected, onSelect, cols = 'grid-cols-2', actionLabel, thumbHeight = 150 }: Props) {
  const [cat, setCat] = useState<'All' | TemplateCategory>('All');
  const list = TEMPLATES.filter((t) => cat === 'All' || t.category === cat);
  return (
    <div>
      <div role="group" aria-label="Filter templates" className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className={`grid gap-4 ${cols}`}>
        {list.map((t) => {
          const on = selected === t.id;
          return (
            <motion.button key={t.id} type="button" aria-pressed={selected ? on : undefined} onClick={() => onSelect(t.id)}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
              className={`group overflow-hidden rounded-2xl border bg-surface text-left shadow-soft transition ${on ? 'border-brand ring-2 ring-brand' : 'border-line hover:border-brand'}`}>
              <TemplateThumb data={data} templateId={t.id} height={thumbHeight} />
              <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted">{t.category}</p>
                </div>
                {on ? (
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-brand text-white"><Check size={14} aria-label="Selected" /></span>
                ) : actionLabel ? (
                  <span className="flex-none rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">{actionLabel}</span>
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
