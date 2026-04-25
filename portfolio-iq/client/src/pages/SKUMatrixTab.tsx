import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skus, SKU, PRODUCT_LINES } from '@/lib/portfolioData';

function ABCBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    A: 'bg-green-500/15 text-green-400 border-green-500/20',
    B: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    C: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border ${colors[tier]}`}>
      {tier}
    </span>
  );
}

function LifecycleBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    Growth: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Maturity: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    Decline: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] border ${colors[stage]}`}>
      {stage}
    </span>
  );
}

function RecBadge({ rec }: { rec: string }) {
  const colors: Record<string, string> = {
    Invest: 'bg-green-500/15 text-green-400 border-green-500/20',
    Optimize: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Consolidate: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    Sunset: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] border ${colors[rec]}`}>
      {rec}
    </span>
  );
}

function GMBar({ gm }: { gm: number }) {
  const color = gm > 45 ? '#3DD68C' : gm >= 35 ? '#F5C518' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(gm / 60) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs" style={{ color }}>{gm}%</span>
    </div>
  );
}

function StrategicFlags({ sku }: { sku: SKU }) {
  return (
    <div className="flex gap-1">
      {sku.aaadmCertified && (
        <span title="AAADM Certified" className="text-[10px] px-1 py-0.5 bg-cyan-500/15 text-cyan-400 rounded border border-cyan-500/20 font-medium">ADM</span>
      )}
      {sku.patentProtected && (
        <span title="Patent Protected" className="text-[10px] px-1 py-0.5 bg-purple-500/15 text-purple-400 rounded border border-purple-500/20 font-medium">PAT</span>
      )}
      {sku.vertical === 'Healthcare' && (
        <span title="Healthcare Vertical" className="text-[10px] px-1 py-0.5 bg-pink-500/15 text-pink-400 rounded border border-pink-500/20 font-medium">HC</span>
      )}
    </div>
  );
}

function SKUDetailPanel({ sku, onClose }: { sku: SKU; onClose: () => void }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <td colSpan={9} className="bg-secondary/50 border-b border-border px-6 py-4">
        <div className="grid grid-cols-4 gap-6 text-xs">
          <div>
            <div className="text-muted-foreground mb-2 font-medium uppercase tracking-wide text-[10px]">Financials</div>
            <div className="space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="text-foreground font-medium">${sku.revenue}M</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GM%</span><span className="text-foreground font-medium">{sku.gmPercent}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cost-to-Serve</span><span className="text-foreground font-medium">{sku.costToServe}% rev</span></div>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-2 font-medium uppercase tracking-wide text-[10px]">Classification</div>
            <div className="space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">ABC Class</span><ABCBadge tier={sku.abcClass} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lifecycle</span><LifecycleBadge stage={sku.lifecycle} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vertical</span><span className="text-foreground">{sku.vertical}</span></div>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-2 font-medium uppercase tracking-wide text-[10px]">Engineering</div>
            <div className="space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Components</span><span className="text-foreground font-medium">{sku.components}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shared</span><span className="text-foreground font-medium">{sku.sharedComponents}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Unique</span><span className="text-foreground font-medium">{sku.components - sku.sharedComponents}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Years in Portfolio</span><span className="text-foreground font-medium">{sku.yearsInPortfolio}yr</span></div>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-2 font-medium uppercase tracking-wide text-[10px]">AI Analysis</div>
            <div className="space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Score</span><span className="text-primary font-bold">{sku.score}/100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="text-foreground">{sku.confidence}</span></div>
              <div className="mt-2 text-muted-foreground leading-relaxed">{sku.topReason}</div>
            </div>
          </div>
        </div>
      </td>
    </motion.tr>
  );
}

function downloadCSV(data: SKU[]) {
  const headers = ['ID', 'Name', 'Line', 'ABC', 'Lifecycle', 'Revenue ($M)', 'GM%', 'Cost-to-Serve%', 'Recommendation', 'Vertical', 'Patent', 'AAADM', 'Years', 'Score'];
  const rows = data.map((s) => [
    s.id, s.name, s.line, s.abcClass, s.lifecycle, s.revenue, s.gmPercent, s.costToServe,
    s.recommendation, s.vertical, s.patentProtected ? 'Yes' : 'No', s.aaadmCertified ? 'Yes' : 'No',
    s.yearsInPortfolio, s.score,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PortfolioIQ_SKU_Export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function SKUMatrixTab() {
  const [filterLine, setFilterLine] = useState('All');
  const [filterABC, setFilterABC] = useState('All');
  const [filterLC, setFilterLC] = useState('All');
  const [filterRec, setFilterRec] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return skus.filter((s) => {
      if (filterLine !== 'All' && s.line !== filterLine) return false;
      if (filterABC !== 'All' && s.abcClass !== filterABC) return false;
      if (filterLC !== 'All' && s.lifecycle !== filterLC) return false;
      if (filterRec !== 'All' && s.recommendation !== filterRec) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterLine, filterABC, filterLC, filterRec, search]);

  const selectClass = 'bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap" data-testid="sku-filters">
        <input
          type="search"
          placeholder="Search SKU name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="sku-search"
          className={`${selectClass} w-48`}
        />
        <select data-testid="filter-line" value={filterLine} onChange={(e) => setFilterLine(e.target.value)} className={selectClass}>
          <option value="All">All Lines</option>
          {PRODUCT_LINES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select data-testid="filter-abc" value={filterABC} onChange={(e) => setFilterABC(e.target.value)} className={selectClass}>
          <option value="All">All ABC</option>
          {['A', 'B', 'C'].map((t) => <option key={t} value={t}>Class {t}</option>)}
        </select>
        <select data-testid="filter-lifecycle" value={filterLC} onChange={(e) => setFilterLC(e.target.value)} className={selectClass}>
          <option value="All">All Stages</option>
          {['Growth', 'Maturity', 'Decline'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select data-testid="filter-rec" value={filterRec} onChange={(e) => setFilterRec(e.target.value)} className={selectClass}>
          <option value="All">All Recs</option>
          {['Invest', 'Optimize', 'Consolidate', 'Sunset'].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="flex-1" />
        <div className="text-xs text-muted-foreground">{filtered.length} SKUs</div>
        <button
          data-testid="export-csv"
          onClick={() => downloadCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-testid="sku-table">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {['SKU Name', 'Line', 'ABC', 'Lifecycle', 'Revenue', 'GM%', 'Cost/Serve', 'Rec', 'Flags'].map((col) => (
                  <th key={col} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wide text-[10px]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sku) => (
                <>
                  <tr
                    key={sku.id}
                    data-testid={`sku-row-${sku.id}`}
                    onClick={() => setExpandedId(expandedId === sku.id ? null : sku.id)}
                    className={`border-b border-border cursor-pointer transition-colors hover:bg-secondary/40 ${expandedId === sku.id ? 'bg-secondary/40' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{sku.name}</div>
                      <div className="text-muted-foreground text-[10px]">{sku.id}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[120px]">
                      <span className="truncate block">{sku.line.replace('ASSA ABLOY ', '').replace('RECORD ', 'RC ')}</span>
                    </td>
                    <td className="px-4 py-3"><ABCBadge tier={sku.abcClass} /></td>
                    <td className="px-4 py-3"><LifecycleBadge stage={sku.lifecycle} /></td>
                    <td className="px-4 py-3 text-foreground font-medium">${sku.revenue}M</td>
                    <td className="px-4 py-3"><GMBar gm={sku.gmPercent} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{sku.costToServe}%</td>
                    <td className="px-4 py-3"><RecBadge rec={sku.recommendation} /></td>
                    <td className="px-4 py-3"><StrategicFlags sku={sku} /></td>
                  </tr>
                  <AnimatePresence>
                    {expandedId === sku.id && (
                      <SKUDetailPanel key={`detail-${sku.id}`} sku={sku} onClose={() => setExpandedId(null)} />
                    )}
                  </AnimatePresence>
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    No SKUs match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
