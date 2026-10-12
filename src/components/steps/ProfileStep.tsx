import type { Profile } from '../../types/portfolio';
import { TextArea, TextInput, FileUpload } from '../ui/Field';
import { readImage, readPdf } from '../../lib/image';
import type { StepProps } from './types';

export default function ProfileStep({ data, setData, errors }: StepProps) {
  const p = data.profile;
  const set = (patch: Partial<Profile>) => setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  return (
    <div className="space-y-4">
      <FileUpload label="Profile photo" accept="image/*" hint="Square photos look best. Saved inside your portfolio." preview={p.profileImage} hasFile={!!p.profileImage} round
        onFile={async (f) => set({ profileImage: await readImage(f, 480) })} onRemove={() => set({ profileImage: '' })} />
      <TextInput label="Full name" required value={p.name} onChange={(v) => set({ name: v })} error={errors['profile.name']} autoComplete="name" maxLength={60} />
      <TextInput label="Professional title" required value={p.title} onChange={(v) => set({ title: v })} error={errors['profile.title']} placeholder="Frontend Developer" maxLength={60} />
      <TextInput label="Tagline" value={p.tagline} onChange={(v) => set({ tagline: v })} placeholder="I build fast, accessible interfaces." maxLength={120} hint="One line that sums you up." />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Email" type="email" value={p.email} onChange={(v) => set({ email: v })} error={errors['profile.email']} autoComplete="email" />
        <TextInput label="Phone" type="tel" value={p.phone} onChange={(v) => set({ phone: v })} error={errors['profile.phone']} autoComplete="tel" />
      </div>
      <TextInput label="Location" value={p.location} onChange={(v) => set({ location: v })} placeholder="City, Country" autoComplete="address-level2" />
      <TextArea label="Short bio" value={p.bio} onChange={(v) => set({ bio: v })} maxLength={280} rows={3} hint="Shown if you leave the About section empty." />
      <FileUpload label="Resume (PDF)" accept="application/pdf" hint="Optional. Visitors get a download link." fileName={p.resumeName} hasFile={!!p.resume}
        onFile={async (f) => set({ resume: await readPdf(f), resumeName: f.name })} onRemove={() => set({ resume: '', resumeName: '' })} />
    </div>
  );
}
