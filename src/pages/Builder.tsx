import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CircleAlert, Eye, Pencil } from 'lucide-react';
import Logo from '../components/Logo';
import PreviewPane from '../components/PreviewPane';
import { Button } from '../components/ui/Button';
import { STEPS, isComplete } from '../components/steps/steps';
import type { StepProps } from '../components/steps/types';
import TemplateStep from '../components/steps/TemplateStep';
import ProfileStep from '../components/steps/ProfileStep';
import AboutStep from '../components/steps/AboutStep';
import SkillsStep from '../components/steps/SkillsStep';
import LinksStep from '../components/steps/LinksStep';
import CustomizeStep from '../components/steps/CustomizeStep';
import PublishStep from '../components/steps/PublishStep';
import { AchievementsStep, CertificatesStep, EducationStep, ExperienceStep, ProjectsStep } from '../components/steps/ListSteps';
import { getRecord, saveRecord } from '../lib/storage';
import { fieldErrors, type StepKey } from '../lib/validate';
import { useNow } from '../lib/hooks';
import type { PortfolioData, PortfolioRecord } from '../types/portfolio';
import NotFound from './NotFound';

export default function Builder() {
  const { id = '' } = useParams();
  const initial = useMemo(() => getRecord(id), [id]);
  if (!initial) return <NotFound title="Portfolio not found" text="This portfolio is not saved in this browser. Open “My Portfolios” to see the ones you have." />;
  return <BuilderInner key={id} initial={initial} />;
}

type SaveState = { state: 'saved' | 'saving' | 'error'; at: number; error?: string };

function BuilderInner({ initial }: { initial: PortfolioRecord }) {
  const [name, setName] = useState(initial.name);
  const [data, setDataState] = useState<PortfolioData>(initial.data);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [save, setSave] = useState<SaveState>({ state: 'saved', at: Date.parse(initial.updatedAt) || Date.now() });
  const now = useNow();
  const setData = useCallback((u: (d: PortfolioData) => PortfolioData) => setDataState(u), []);

  useEffect(() => {
    if (data === initial.data && name === initial.name) return;
    setSave((s) => ({ ...s, state: 'saving' }));
    const t = setTimeout(() => {
      const res = saveRecord({ ...initial, name, data, updatedAt: new Date().toISOString() });
      setSave(res.ok ? { state: 'saved', at: Date.now() } : { state: 'error', at: Date.now(), error: res.error });
    }, 400);
    return () => clearTimeout(t);
  }, [data, name, initial]);

  const errors = useMemo(() => fieldErrors(data), [data]);
  const goTo = useCallback((k: StepKey) => {
    const i = STEPS.findIndex((s) => s.key === k);
    if (i >= 0) { setStep(i); setView('edit'); }
  }, []);

  const cur = STEPS[step];
  const props: StepProps = { data, setData, errors };
  const body = (() => {
    switch (cur.key) {
      case 'template': return <TemplateStep {...props} />;
      case 'profile': return <ProfileStep {...props} />;
      case 'about': return <AboutStep {...props} />;
      case 'education': return <EducationStep {...props} />;
      case 'skills': return <SkillsStep {...props} />;
      case 'projects': return <ProjectsStep {...props} />;
      case 'experience': return <ExperienceStep {...props} />;
      case 'certificates': return <CertificatesStep {...props} />;
      case 'achievements': return <AchievementsStep {...props} />;
      case 'links': return <LinksStep {...props} />;
      case 'customize': return <CustomizeStep {...props} />;
      default: return <PublishStep {...props} id={initial.id} goTo={goTo} />;
    }
  })();

  const secs = Math.max(0, Math.round((now - save.at) / 1000));
  const ago = secs < 10 ? 'just now' : secs < 60 ? 'a few seconds ago' : secs < 3600 ? `${Math.round(secs / 60)} min ago` : new Date(save.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2.5 sm:px-4">
        <Link to="/dashboard" aria-label="Back to My Portfolios" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/5"><ArrowLeft size={18} /></Link>
        <Logo compact />
        <input aria-label="Portfolio name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="field !w-40 !py-1.5 sm:!w-60" />
        <p role="status" className={`hidden items-center gap-1.5 text-xs sm:flex ${save.state === 'error' ? 'text-red-500' : 'text-muted'}`}>
          {save.state === 'error' ? <><CircleAlert size={14} /> {save.error}</> : save.state === 'saving' ? 'Saving…' : <><Check size={14} className="text-green-500" /> Saved {ago}</>}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Button className="lg:hidden" icon={view === 'edit' ? <Eye size={16} /> : <Pencil size={16} />} onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}>{view === 'edit' ? 'Preview' : 'Edit'}</Button>
          <Button variant="primary" onClick={() => goTo('publish')}>Generate<span className="hidden sm:inline"> portfolio</span></Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[13rem_minmax(22rem,28rem)_1fr]">
        <nav aria-label="Steps" className="hidden overflow-y-auto border-r border-line bg-surface p-3 lg:block">
          <ol className="space-y-1">
            {STEPS.map((s, i) => {
              const done = isComplete(s.key, data);
              const active = i === step;
              return (
                <li key={s.key}>
                  <button type="button" onClick={() => setStep(i)} aria-current={active ? 'step' : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? 'bg-brand/10 font-semibold text-brand' : 'hover:bg-ink/5'}`}>
                    <span className={`grid h-6 w-6 flex-none place-items-center rounded-full text-xs ${done ? 'bg-green-500 text-white' : active ? 'bg-brand text-white' : 'border border-line text-muted'}`}>{done ? <Check size={13} aria-label="Done" /> : i + 1}</span>
                    <span className="flex-1 text-left">{s.title}</span>
                    {s.optional && <span className="text-[10px] uppercase tracking-wide text-muted">optional</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <section aria-label="Editor" className={`min-h-0 flex-col border-r border-line ${view === 'edit' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="border-b border-line bg-surface px-4 py-3 lg:hidden">
            <label htmlFor="step-select" className="sr-only">Step</label>
            <select id="step-select" className="field" value={step} onChange={(e) => setStep(Number(e.target.value))}>
              {STEPS.map((s, i) => <option key={s.key} value={i}>{i + 1}. {s.title}</option>)}
            </select>
          </div>
          <div className="h-1 bg-line" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
            <div className="h-full bg-brand transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Step {step + 1} of {STEPS.length}</p>
            <h1 className="text-2xl font-bold tracking-tight">{cur.title}</h1>
            <p className="mb-5 mt-1 text-sm text-muted">{cur.hint}</p>
            <AnimatePresence mode="wait">
              <motion.div key={cur.key} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>{body}</motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between border-t border-line bg-surface px-4 py-3">
            <Button icon={<ArrowLeft size={16} />} disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
            {step < STEPS.length - 1 && <Button variant="primary" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Next <ArrowRight size={16} /></Button>}
          </div>
        </section>

        <section aria-label="Live preview" className={`min-h-0 flex-col ${view === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          <PreviewPane data={data} id={initial.id} />
        </section>
      </div>
    </div>
  );
}
