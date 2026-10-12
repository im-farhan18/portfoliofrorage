import type { SocialPlatform } from '../../types/portfolio';
import { PLATFORM_LABELS } from '../../engine/options';
import { newId } from '../../data/demo';
import { TextInput } from '../ui/Field';
import type { StepProps } from './types';

const PLATFORMS: SocialPlatform[] = ['github', 'linkedin', 'instagram', 'youtube', 'twitter', 'website', 'other'];

export default function LinksStep({ data, setData, errors }: StepProps) {
  const setUrl = (platform: SocialPlatform, url: string) =>
    setData((d) => {
      const list = [...d.socialLinks];
      const i = list.findIndex((l) => l.platform === platform);
      if (i >= 0) { if (url === '') list.splice(i, 1); else list[i] = { ...list[i], url }; }
      else if (url !== '') list.push({ id: newId(), platform, url });
      return { ...d, socialLinks: list };
    });
  return (
    <div className="space-y-4">
      {PLATFORMS.map((p) => {
        const i = data.socialLinks.findIndex((l) => l.platform === p);
        return (
          <TextInput key={p} label={p === 'other' ? 'Another link' : PLATFORM_LABELS[p]} type="url" value={i >= 0 ? data.socialLinks[i].url : ''}
            onChange={(v) => setUrl(p, v)} error={i >= 0 ? errors[`socialLinks.${i}.url`] : undefined}
            placeholder={p === 'github' ? 'https://github.com/your-name' : p === 'linkedin' ? 'https://www.linkedin.com/in/your-name' : 'https://…'} />
        );
      })}
      <p className="text-sm text-muted">Links open in a new tab. Leave a field empty to hide it.</p>
    </div>
  );
}
