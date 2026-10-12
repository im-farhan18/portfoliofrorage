import { useMemo, useRef } from 'react';
import type { PortfolioData } from '../types/portfolio';
import { renderPortfolio } from '../engine/render';
import { previewAs } from '../data/demo';
import { useElementWidth, useInView } from '../lib/hooks';

const VIEW_W = 1100;

/** A real, scaled-down render of the template (not a placeholder image). Renders only when scrolled into view. */
export default function TemplateThumb({ data, templateId, height = 150 }: { data: PortfolioData; templateId: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const width = useElementWidth(ref);
  const html = useMemo(() => (seen ? renderPortfolio(previewAs(data, templateId)).html : ''), [seen, data, templateId]);
  const scale = (width || VIEW_W * 0.2) / VIEW_W;
  return (
    <div ref={ref} className="relative overflow-hidden bg-white" style={{ height }} aria-hidden="true">
      {html && (
        <iframe title="" tabIndex={-1} sandbox="allow-same-origin" srcDoc={html} className="pointer-events-none absolute left-0 top-0 border-0"
          style={{ width: VIEW_W, height: height / scale, transform: `scale(${scale})`, transformOrigin: '0 0' }} />
      )}
    </div>
  );
}
