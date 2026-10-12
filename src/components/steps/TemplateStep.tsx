import { applyTemplate } from '../../data/demo';
import TemplateGallery from '../TemplateGallery';
import type { StepProps } from './types';

export default function TemplateStep({ data, setData }: StepProps) {
  return (
    <div>
      <TemplateGallery data={data} selected={data.settings.template} onSelect={(id) => setData((d) => applyTemplate(d, id))} cols="grid-cols-2" />
      <p className="mt-5 rounded-xl bg-brand/10 px-4 py-3 text-sm">Your details stay the same when you switch templates. Only the design changes.</p>
    </div>
  );
}
