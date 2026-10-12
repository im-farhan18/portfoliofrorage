import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { renderPortfolio } from '../engine/render';
import { useDebounced } from '../lib/hooks';

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: '100%', Icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: '768px', Icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: '390px', Icon: Smartphone },
] as const;

/** Live preview. The iframe has no "allow-scripts", so it can only show a script-free page, exactly like the exported file. */
export default function PreviewPane({ data, id }: { data: PortfolioData; id: string }) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]['id']>('desktop');
  const settled = useDebounced(data, 150);
  const html = useMemo(() => renderPortfolio(settled).html, [settled]);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    let y = 0;
    try { y = f.contentWindow?.scrollY ?? 0; } catch { /* keep 0 */ }
    f.onload = () => { try { f.contentWindow?.scrollTo(0, y); } catch { /* ignore */ } };
    f.srcdoc = html;
  }, [html]);

  const width = DEVICES.find((d) => d.id === device)?.width ?? '100%';
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-ink/[0.04]">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2">
        <div role="group" aria-label="Preview size" className="flex gap-1">
          {DEVICES.map(({ id: d, label, Icon }) => (
            <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)} title={label}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${device === d ? 'bg-brand/10 text-brand' : 'text-muted hover:text-ink'}`}>
              <Icon size={16} aria-hidden="true" /><span className="hidden xl:inline">{label}</span><span className="sr-only xl:hidden">{label}</span>
            </button>
          ))}
        </div>
        <Link to={`/view/${id}`} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted transition hover:text-ink">
          <ExternalLink size={14} aria-hidden="true" /> Full preview
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 justify-center overflow-auto p-4">
        <iframe ref={frame} title="Live portfolio preview" sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          style={{ width, maxWidth: '100%' }} className="h-full min-h-[480px] rounded-xl border border-line bg-white shadow-soft transition-[width] duration-300" />
      </div>
    </div>
  );
}
