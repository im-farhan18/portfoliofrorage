// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { createRecord, getRecord, listRecords } from './lib/storage';
import { demoData, emptyData } from './data/demo';

const blobs: Blob[] = [];

beforeAll(() => {
  class RO { observe() {} unobserve() {} disconnect() {} }
  class IO {
    cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) { this.cb = cb; }
    observe(el: Element) { this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    unobserve() {} disconnect() {} takeRecords() { return []; }
  }
  Object.assign(globalThis, { ResizeObserver: RO, IntersectionObserver: IO });
  window.matchMedia = ((q: string) => ({ matches: false, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false })) as typeof window.matchMedia;
  window.scrollTo = () => {};
  URL.createObjectURL = (b: Blob | MediaSource) => { blobs.push(b as Blob); return 'blob:test'; };
  URL.revokeObjectURL = () => {};
  HTMLAnchorElement.prototype.click = () => {};
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});

const errors: string[] = [];
const spy = vi.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { errors.push(a.map(String).join(' ')); });
afterEach(() => {
  cleanup();
  localStorage.clear();
  blobs.length = 0;
  const real = errors.splice(0).filter((m) => /Warning:|Uncaught|TypeError|ReferenceError/.test(m) && !/not wrapped in act/.test(m));
  expect(real).toEqual([]);
});
void spy;

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
const stepBtn = (name: RegExp) => within(screen.getByRole('navigation', { name: 'Steps' })).getByRole('button', { name });
const editor = () => within(screen.getByRole('region', { name: 'Editor' }));

describe('pages', () => {
  it('landing page shows the hero and links to the builder', () => {
    open('/');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Build a Portfolio');
    expect(screen.getAllByRole('link', { name: /Create My Portfolio/i })[0].getAttribute('href')).toBe('/new');
    expect(screen.getAllByRole('link', { name: /Explore Templates/i }).length).toBeGreaterThan(0);
  });
  it('template gallery page lists every template with live previews', () => {
    open('/templates');
    expect(screen.getByRole('heading', { name: 'Template gallery' })).toBeTruthy();
    expect(document.querySelectorAll('iframe').length).toBeGreaterThanOrEqual(15);
    expect(screen.getByRole('button', { name: /CyberPulse/ })).toBeTruthy();
  });
  it('unknown routes and missing portfolios show a friendly page', () => {
    open('/nope');
    expect(screen.getByText('Page not found')).toBeTruthy();
    cleanup();
    open('/builder/does-not-exist');
    expect(screen.getByText('Portfolio not found')).toBeTruthy();
  });
});

describe('builder flow', () => {
  it('creates a portfolio from sample data and opens the builder', async () => {
    const user = userEvent.setup();
    open('/new');
    await user.click(screen.getByRole('button', { name: /Start with sample data/i }));
    expect(await screen.findByText(/Step 1 of 12/)).toBeTruthy();
    expect(listRecords()).toHaveLength(1);
  });

  it('typing updates the live preview, autosaves, and template switching keeps the data', async () => {
    const rec = createRecord(demoData(), 'Test');
    const user = userEvent.setup();
    open(`/builder/${rec.id}`);
    await user.click(stepBtn(/Profile/));
    const name = await screen.findByLabelText(/Full name/);
    await user.clear(name);
    await user.type(name, 'Priya Sharma');
    await waitFor(() => expect(getRecord(rec.id)?.data.profile.name).toBe('Priya Sharma'));
    await waitFor(() => expect((screen.getByTitle('Live portfolio preview') as HTMLIFrameElement).srcdoc).toContain('Priya Sharma'));

    await user.click(stepBtn(/Template/));
    await user.click(await screen.findByRole('button', { name: /Minimal Pro/ }));
    await waitFor(() => expect(getRecord(rec.id)?.data.settings.template).toBe('minimal-pro'));
    expect(getRecord(rec.id)?.data.profile.name).toBe('Priya Sharma');
    expect(getRecord(rec.id)?.data.projects).toHaveLength(4);
    await waitFor(() => expect((screen.getByTitle('Live portfolio preview') as HTMLIFrameElement).srcdoc).toContain('Priya Sharma'));
  });

  it('adds a project and shows validation messages', async () => {
    const rec = createRecord(emptyData(), 'Empty');
    const user = userEvent.setup();
    open(`/builder/${rec.id}`);
    await user.click(stepBtn(/Projects/));
    await user.click(await editor().findByRole('button', { name: /Add project/i }));
    await user.type(await screen.findByLabelText(/Project name/), 'Portfolio Site');
    const gh = screen.getByLabelText(/GitHub URL/);
    await user.type(gh, 'not-a-link');
    await user.tab();
    expect(await screen.findByText(/Start the link with https/)).toBeTruthy();
    await waitFor(() => expect(getRecord(rec.id)?.data.projects[0]?.name).toBe('Portfolio Site'));
  });

  it('blocks generating until required fields are fixed, then generates a script-free portfolio', async () => {
    const rec = createRecord(emptyData(), 'Empty');
    const user = userEvent.setup();
    open(`/builder/${rec.id}`);
    await user.click(stepBtn(/Generate/));
    expect(await screen.findByText(/Please fix these first/)).toBeTruthy();
    await user.click(editor().getAllByRole('button', { name: 'Fix' })[0]);
    expect(await screen.findByText(/Step 2 of 12/)).toBeTruthy();
    await user.type(await screen.findByLabelText(/Full name/), 'Sam Lee');
    await user.type(screen.getByLabelText(/Professional title/), 'Student');

    await user.click(stepBtn(/Generate/));
    await user.click(await editor().findByRole('button', { name: /Generate portfolio/ }));
    expect(await screen.findByRole('heading', { name: 'Portfolio ready!' })).toBeTruthy();
    expect(screen.getByText(/JavaScript:/).textContent).toContain('Not included');
    expect(screen.getByText('No <script> tags')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Download HTML/ }));
    await user.click(screen.getByRole('button', { name: /Download ZIP/ }));
    await waitFor(() => expect(blobs.length).toBe(2));
    await user.click(screen.getByRole('tab', { name: 'CSS' }));
    expect(document.querySelector('pre code')?.textContent).toContain('--ac:');
  });
});

describe('dashboard', () => {
  it('lists, duplicates and deletes portfolios', async () => {
    createRecord(demoData(), 'First');
    const user = userEvent.setup();
    open('/dashboard');
    expect(screen.getByText('First')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Duplicate/ }));
    await waitFor(() => expect(listRecords()).toHaveLength(2));
    expect(await screen.findByText('First (copy)')).toBeTruthy();
    await user.click(screen.getAllByRole('button', { name: /Delete/ })[0]);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(listRecords()).toHaveLength(1));
  });
});
