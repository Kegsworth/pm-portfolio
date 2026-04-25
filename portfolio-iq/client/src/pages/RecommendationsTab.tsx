import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skus, SKU, LINE_COLORS } from '@/lib/portfolioData';

type RecType = 'Invest' | 'Optimize' | 'Consolidate' | 'Sunset';

const REC_CONFIG: Record<RecType, { color: string; bg: string; border: string; icon: string }> = {
  Invest: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '↑' },
  Optimize: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '◎' },
  Consolidate: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⊕' },
  Sunset: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '↓' },
};

const COLUMNS: RecType[] = ['Invest', 'Optimize', 'Consolidate', 'Sunset'];

function ConfidenceBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    High: 'bg-green-500/15 text-green-400 border-green-500/20',
    Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    Low: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border ${colors[level]}`}>
      {level}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#3DD68C' : score >= 60 ? '#4A9EFF' : score >= 40 ? '#F5C518' : '#EF4444';
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

function SKUCard({ sku }: { sku: SKU }) {
  const cfg = REC_CONFIG[sku.recommendation as RecType];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg border p-3 ${cfg.bg} ${cfg.border} hover:brightness-110 transition-all cursor-default`}
      data-testid={`rec-card-${sku.id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <div className="text-xs font-semibold text-foreground leading-tight">{sku.name}</div>
          <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
            {sku.line.replace('ASSA ABLOY ', '').replace('RECORD ', 'RC ')}
          </div>
        </div>
        <ConfidenceBadge level={sku.confidence} />
      </div>
      <div className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
        {sku.topReason}
      </div>
      <ScoreBar score={sku.score} />
      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
        <span>${sku.revenue}M</span>
        <span>·</span>
        <span>{sku.gmPercent}% GM</span>
        <span>·</span>
        <span className="font-medium" style={{ color: LINE_COLORS[sku.lineIndex] }}>
          {sku.abcClass}
        </span>
      </div>
    </motion.div>
  );
}

function ExportModal({ onClose }: { onClose: () => void }) {
  const investSkus = skus.filter((s) => s.recommendation === 'Invest');
  const optimizeSkus = skus.filter((s) => s.recommendation === 'Optimize');
  const consolidateSkus = skus.filter((s) => s.recommendation === 'Consolidate');
  const sunsetSkus = skus.filter((s) => s.recommendation === 'Sunset');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl w-[720px] max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="7" fill="hsl(16 90% 58%)"/>
                <path d="M8 22V10l4.5 7 4.5-9 4.5 7.5L24 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="24" cy="10" r="2" fill="white"/>
              </svg>
              <div>
                <div className="text-base font-bold text-foreground" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  PortfolioIQ — Executive Brief
                </div>
                <div className="text-xs text-muted-foreground">ASSA ABLOY NA PES · FY2024 SKU Rationalization</div>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">×</button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Summary */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
            <h3 className="text-sm font-bold text-primary mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Executive Summary
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Recommended portfolio actions would: <strong>increase portfolio GM% from 38.7% to 41.2%</strong>, reduce
              active SKU count from 47 to 38, free <strong>$420K in supply chain savings</strong>, and focus engineering
              capacity on <strong>12 high-growth SKUs</strong>. Value at risk from Sunset SKUs is $3.2M in revenue, more
              than offset by $600K+ in total cost savings and margin improvement.
            </p>
          </div>

          {/* Impact table */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Projected Impact</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Portfolio GM% improvement', from: '38.7%', to: '41.2%', positive: true },
                { label: 'Active SKU reduction', from: '47', to: '38', positive: true },
                { label: 'Supply chain savings', value: '$420K/yr', positive: true },
                { label: 'Revenue at risk (Sunset)', value: '-$3.2M', positive: false },
                { label: 'Engineering focus (Invest SKUs)', value: '12 SKUs', positive: true },
                { label: 'Gross margin improvement', value: '+$180K', positive: true },
              ].map((item) => (
                <div key={item.label} className="bg-secondary/60 rounded-lg p-3 text-xs">
                  <div className="text-muted-foreground mb-1">{item.label}</div>
                  <div className={`font-bold text-sm ${item.positive ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    {item.value ?? `${item.from} → ${item.to}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decisions */}
          {[
            { title: 'Invest (12 SKUs)', skus: investSkus, color: '#3DD68C' },
            { title: 'Optimize (19 SKUs)', skus: optimizeSkus, color: '#4A9EFF' },
            { title: 'Consolidate (7 SKUs)', skus: consolidateSkus, color: '#F5C518' },
            { title: 'Sunset (9 SKUs)', skus: sunsetSkus, color: '#EF4444' },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                {section.title}
              </h3>
              <div className="space-y-1.5">
                {section.skus.map((sku) => (
                  <div key={sku.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-secondary/40 text-xs">
                    <span className="text-foreground font-medium">{sku.name}</span>
                    <span className="text-muted-foreground">{sku.line.replace('ASSA ABLOY ', '').replace('RECORD ', 'RC ')}</span>
                    <span style={{ color: section.color }}>${sku.revenue}M · {sku.gmPercent}% GM</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 pb-6">
          <p className="text-[11px] text-muted-foreground text-center">
            Generated by PortfolioIQ · ASSA ABLOY NA Pedestrian Entrance Systems · FY2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsTab() {
  const [showExport, setShowExport] = useState(false);

  const grouped = COLUMNS.reduce<Record<RecType, SKU[]>>(
    (acc, rec) => {
      acc[rec] = skus.filter((s) => s.recommendation === rec).sort((a, b) => b.score - a.score);
      return acc;
    },
    { Invest: [], Optimize: [], Consolidate: [], Sunset: [] }
  );

  return (
    <div className="p-6 space-y-5">
      {/* Impact Banner */}
      <div className="bg-card border border-primary/20 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: 'GM% After Optimization', value: '41.2%', color: 'text-green-400' },
              { label: 'Active SKUs After', value: '38', color: 'text-blue-400' },
              { label: 'Supply Chain Savings', value: '$420K', color: 'text-primary' },
              { label: 'Invest-focus SKUs', value: '12', color: 'text-primary' },
            ].map((item) => (
              <div key={item.label}>
                <div className={`text-xl font-bold ${item.color}`} style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{item.value}</div>
                <div className="text-[11px] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
          <button
            data-testid="export-report"
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Export Executive Brief
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((rec) => {
          const cfg = REC_CONFIG[rec];
          const columnSkus = grouped[rec];
          return (
            <div key={rec} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-base ${cfg.color}`}>{cfg.icon}</span>
                  <span className={`text-sm font-bold ${cfg.color}`} style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{rec}</span>
                </div>
                <span className={`text-xs font-medium ${cfg.color} opacity-70`}>{columnSkus.length}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 360px)' }}>
                {columnSkus.map((sku) => (
                  <SKUCard key={sku.id} sku={sku} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ExportModal onClose={() => setShowExport(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
