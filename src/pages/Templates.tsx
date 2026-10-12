import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TemplateGallery from '../components/TemplateGallery';
import { demoData } from '../data/demo';
import { TEMPLATES } from '../engine/templates';

const DEMO = demoData();

export default function Templates() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Template gallery</h1>
        <p className="mb-8 mt-2 max-w-2xl text-muted">{TEMPLATES.length} templates, each shown as a live render with sample data. Pick one to start. You can switch later without losing anything.</p>
        <TemplateGallery data={DEMO} onSelect={(id) => nav(`/new?template=${id}`)} cols="grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" actionLabel="Use template" thumbHeight={190} />
      </main>
      <Footer />
    </div>
  );
}
