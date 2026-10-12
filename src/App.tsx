import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ToastProvider } from './components/ui/Toast';
import Landing from './pages/Landing';
import Templates from './pages/Templates';
import NewPortfolio from './pages/NewPortfolio';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import View from './pages/View';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/new" element={<NewPortfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<Builder />} />
          <Route path="/view/:id" element={<View />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </MotionConfig>
  );
}
