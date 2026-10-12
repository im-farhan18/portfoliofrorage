import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CircleAlert, Copy, Download, ExternalLink, FileArchive, Printer, X } from 'lucide-react';
import { generatePortfolio, buildZipBytes, zipName, type GeneratedPortfolio } from '../../engine/export';
import { issuesOf, type StepKey } from '../../lib/validate';
import { copyText, downloadBlob, downloadText, printHtml } from '../../lib/download';
import { Button, btnClass } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { useToast } from '../ui/Toast';
import type { StepProps } from './types';

const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} KB`;

export default function PublishStep({ data, id, goTo }: StepProps & { id: string; goTo: (k: StepKey) => void }) {
  const toast = useToast();
  const issues = useMemo(() => issuesOf(data), [data]);
  const [gen, setGen] = useState<GeneratedPortfolio | null>(null);
  const [tab, setTab] = useState<'html' | 'css'>('html');
  useEffect(() => setGen(null), [data]);

  const generate = () => {
    if (issues.length) return;
    const g = generatePortfolio(data);
    setGen(g);
    if (g.ok) toast('Portfolio ready!');
    else toast('Some checks failed. See the list below.', 'error');
  };
  const zip = async () => {
    try {
      const bytes = await buildZipBytes(data);
      downloadBlob(zipName(data), new Blob([bytes as unknown as BlobPart], { type: 'application/zip' }));
      toast('ZIP downloaded');
    } catch { toast('Could not create the ZIP file.', 'error'); }
  };

  if (issues.length) {
    return (
      <div className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-5">
        <h3 className="flex items-center gap-2 font-semibold"><CircleAlert size={18} aria-hidden="true" /> Almost there. Please fix these first</h3>
        <ul className="mt-3 space-y-2">
          {issues.map((i) => (
            <li key={i.path} className="flex items-center justify-between gap-3 text-sm">
              <span>{i.message}</span>
              <Button size="sm" onClick={() => goTo(i.step)}>Fix</Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!gen ? (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-muted">Everything looks good. PortfolioForge will now create your website as plain HTML and CSS and check that it contains no JavaScript.</p>
          <Button variant="primary" size="lg" className="mt-4" onClick={generate}>Generate portfolio</Button>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${gen.ok ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>{gen.ok ? <Check /> : <X />}</span>
              <div>
                <h3 className="text-lg font-semibold">{gen.ok ? 'Portfolio ready!' : 'Needs attention'}</h3>
                <p className="text-sm text-muted">Output: <b>Static HTML + CSS</b> · JavaScript: <b>Not included</b></p>
              </div>
            </div>
            <ul className="mt-4 grid gap-1.5 text-sm">
              {gen.checks.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.ok ? <Check size={15} className="text-green-500" aria-label="Passed" /> : <X size={15} className="text-red-500" aria-label="Failed" />} {c.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link to={`/view/${id}`} target="_blank" rel="noopener noreferrer" className={btnClass('secondary')}><ExternalLink size={16} aria-hidden="true" /> Preview</Link>
            <Button variant="primary" icon={<Download size={16} />} disabled={!gen.ok} onClick={() => { downloadText('index.html', gen.single.html); toast('index.html downloaded'); }}>Download HTML ({kb(gen.single.html.length)})</Button>
            <Button icon={<FileArchive size={16} />} disabled={!gen.ok} onClick={() => void zip()}>Download ZIP</Button>
            <Button icon={<Printer size={16} />} onClick={() => printHtml(gen.single.html)}>Print / Save as PDF</Button>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Inspect generated code</h3>
              <Tabs label="Code" value={tab} onChange={setTab} tabs={[{ id: 'html', label: 'HTML' }, { id: 'css', label: 'CSS' }]} />
            </div>
            <pre tabIndex={0} className="max-h-96 overflow-auto rounded-xl bg-[#0b0d14] p-4 text-xs leading-relaxed text-emerald-200"><code>{tab === 'html' ? gen.folder.html : gen.folder.css}</code></pre>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted">This is the ZIP version (index.html + style.css). The single-file download has the same CSS inside a style tag.</p>
              <Button size="sm" icon={<Copy size={14} />} onClick={async () => toast((await copyText(tab === 'html' ? gen.folder.html : gen.folder.css)) ? 'Copied' : 'Copy failed', 'success')}>Copy</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
