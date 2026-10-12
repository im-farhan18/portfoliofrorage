export type UiTheme = 'system' | 'light' | 'dark';
const KEY = 'pf:theme';

export function getStoredTheme(): UiTheme {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}
export function applyTheme(t: UiTheme): void {
  const root = document.documentElement;
  if (t === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', t);
  try { localStorage.setItem(KEY, t); } catch { /* storage unavailable */ }
}
export const applyStoredTheme = (): void => applyTheme(getStoredTheme());
