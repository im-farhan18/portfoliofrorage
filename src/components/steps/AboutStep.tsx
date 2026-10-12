import { TextArea } from '../ui/Field';
import type { StepProps } from './types';

export default function AboutStep({ data, setData }: StepProps) {
  const a = data.about;
  const set = (patch: Partial<typeof a>) => setData((d) => ({ ...d, about: { ...d.about, ...patch } }));
  return (
    <div className="space-y-4">
      <TextArea label="Introduction" value={a.introduction} onChange={(v) => set({ introduction: v })} maxLength={160} rows={2} hint="One friendly opening line. Example: “Hi, I’m Alex.”" />
      <TextArea label="About me" value={a.aboutMe} onChange={(v) => set({ aboutMe: v })} maxLength={900} rows={6} hint="Two to four sentences: who you are, what you study, what you enjoy building. Leave a blank line to start a new paragraph." />
      <TextArea label="Career objective" value={a.objective} onChange={(v) => set({ objective: v })} maxLength={300} rows={3} hint="Optional. What kind of role or internship are you looking for?" />
    </div>
  );
}
