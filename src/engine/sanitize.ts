/** Everything that touches user text goes through these helpers, so exported HTML stays safe. */
const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

/** Only plain http(s) links are allowed. Everything else (javascript:, data:, …) is dropped. */
export const safeUrl = (u: string): string => {
  const t = (u ?? '').trim();
  return /^https?:\/\/[^\s"'<>]+$/i.test(t) ? t : '';
};
export const isEmail = (s: string): boolean => /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test((s ?? '').trim());
export const safeImage = (u: string): string => (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(u ?? '') ? u : '');
export const safePdf = (u: string): string => (/^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/.test(u ?? '') ? u : '');
export const safeColor = (c: string, fallback = '#6d5efc'): string => (/^#[0-9a-f]{6}$/i.test(c ?? '') ? c : fallback);
export const splitList = (s: string, sep = ','): string[] => (s ?? '').split(sep).map((x) => x.trim()).filter(Boolean);
export const splitLines = (s: string): string[] => splitList(s, '\n');
export const slug = (s: string): string => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
