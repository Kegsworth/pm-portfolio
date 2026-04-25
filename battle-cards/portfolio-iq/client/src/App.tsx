import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';
import OverviewTab from './pages/OverviewTab';
import SKUMatrixTab from './pages/SKUMatrixTab';
import MarginAnalysisTab from './pages/MarginAnalysisTab';
import LifecycleMapTab from './pages/LifecycleMapTab';
import ComponentNetworkTab from './pages/ComponentNetworkTab';
import RecommendationsTab from './pages/RecommendationsTab';

type Tab = 'overview' | 'sku-matrix' | 'margin' | 'lifecycle' | 'components' | 'recommendations';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z' },
  { id: 'sku-matrix', label: 'SKU Matrix', icon: 'M3 5h18M3 10h18M3 15h18M3 20h18' },
  { id: 'margin', label: 'Margin Analysis', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
  { id: 'lifecycle', label: 'Lifecycle Map', icon: 'M8 9l4-4 4 4m0 6l-4 4-4-4' },
  { id: 'components', label: 'Component Network', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { id: 'recommendations', label: 'Recommendations', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark((d) => {
    const next = !d;
    document.documentElement.classList.toggle('dark', next);
    return next;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 flex flex-col border-r border-border bg-sidebar">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="PortfolioIQ Logo">
                  <rect width="32" height="32" rx="7" fill="hsl(16 90% 58%)"/>
                  <path d="M8 22V10l4.5 7 4.5-9 4.5 7.5L24 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="24" cy="10" r="2" fill="white"/>
                </svg>
                <div>
                  <div className="text-sm font-bold text-foreground" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>PortfolioIQ</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">ASSA ABLOY · NA PES</div>
                </div>
              </div>
              <button onClick={toggleDark} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" aria-label="Toggle dark mode" data-testid="theme-toggle">
                {dark
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1" data-testid="sidebar-nav">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  data-testid={`nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left ${
                    activeTab === tab.id
                      ? 'bg-primary/15 text-primary font-medium border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border">
              <div className="text-[11px] text-muted-foreground leading-relaxed">
                <div className="font-medium text-foreground/60 mb-1">ASSA ABLOY NA PES</div>
                <div>37 Active SKUs · 6 Lines</div>
                <div>FY2024 Portfolio Review</div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Top bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-[hsl(220_22%_7%)] flex-shrink-0">
              <div>
                <h1 className="text-base font-bold text-foreground" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {TABS.find((t) => t.id === activeTab)?.label}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pedestrian Entrance Systems · SKU Rationalization Engine
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live · FY2024 Q4
                </div>
              </div>
            </header>

            {/* Tab content */}
            <div className="flex-1 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="h-full"
                >
                  {activeTab === 'overview' && <OverviewTab />}
                  {activeTab === 'sku-matrix' && <SKUMatrixTab />}
                  {activeTab === 'margin' && <MarginAnalysisTab />}
                  {activeTab === 'lifecycle' && <LifecycleMapTab />}
                  {activeTab === 'components' && <ComponentNetworkTab />}
                  {activeTab === 'recommendations' && <RecommendationsTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
