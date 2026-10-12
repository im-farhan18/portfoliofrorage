import type { PortfolioData, PortfolioRecord } from '../types/portfolio';
import { mergeData, newId } from '../data/demo';

/** Local persistence (browser localStorage). A backend can replace this module later without touching the UI. */
const INDEX = 'pf:index';
const key = (id: string) => `pf:p:${id}`;

function read<T>(k: string): T | null {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
const ids = (): string[] => read<string[]>(INDEX) ?? [];

export function getRecord(id: string): PortfolioRecord | null {
  const r = read<PortfolioRecord>(key(id));
  return r ? { ...r, data: mergeData(r.data) } : null;
}
export function listRecords(): PortfolioRecord[] {
  return ids().map(getRecord).filter((r): r is PortfolioRecord => r !== null).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export function saveRecord(rec: PortfolioRecord): { ok: boolean; error?: string } {
  try {
    localStorage.setItem(key(rec.id), JSON.stringify(rec));
    const list = ids();
    if (!list.includes(rec.id)) localStorage.setItem(INDEX, JSON.stringify([...list, rec.id]));
    return { ok: true };
  } catch (e) {
    const full = e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22);
    return { ok: false, error: full ? 'Browser storage is full. Remove a large photo or resume.' : 'Could not save in this browser.' };
  }
}
export function createRecord(data: PortfolioData, name = 'My Portfolio'): PortfolioRecord {
  const now = new Date().toISOString();
  const rec: PortfolioRecord = { id: newId(), name, createdAt: now, updatedAt: now, data };
  saveRecord(rec);
  return rec;
}
export function duplicateRecord(id: string): PortfolioRecord | null {
  const r = getRecord(id);
  return r ? createRecord(structuredClone(r.data), `${r.name} (copy)`) : null;
}
export function deleteRecord(id: string): void {
  try {
    localStorage.removeItem(key(id));
    localStorage.setItem(INDEX, JSON.stringify(ids().filter((x) => x !== id)));
  } catch { /* nothing to delete */ }
}
